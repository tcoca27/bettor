import { fixtures, scoreBet, teams } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { db, getMostPopularMatchByHouse } from "@/drizzle/db";
import React from "react";
import { alias } from "drizzle-orm/pg-core";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Table, TableBody } from "./ui/table";
import MatchRow from "./MatchRow";

const YesterdayWinner = async ({
  houseId,
  members,
}: {
  houseId: string;
  members:
    | {
        id: string;
        name: string | null;
      }[]
    | undefined;
}) => {
  const teams2 = alias(teams, "teams2");
  const gd = new Date("2024-06-17");
  const todaysDate = new Date() > gd ? new Date() : gd;
  todaysDate.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(todaysDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFixtures = await db
    .select()
    .from(fixtures)
    .where(
      sql`
    date >= ${yesterday.toISOString()} AND date < ${todaysDate.toISOString()}
  `
    )
    .innerJoin(teams, eq(fixtures.homeTeam, teams.id))
    .innerJoin(teams2, eq(fixtures.awayTeam, teams2.id));

  if (yesterdayFixtures.length === 0) return null;

  const fixture = await getMostPopularMatchByHouse(
    yesterdayFixtures.map((fixture) => fixture.fixtures.id),
    houseId
  );

  const betYesterday = yesterdayFixtures.find(
    (f) => f.fixtures.id === fixture[0]?.id
  );

  const bets = await db
    .select()
    .from(scoreBet)
    .where(
      and(
        eq(scoreBet.fixtureId, betYesterday?.fixtures.id as number),
        eq(scoreBet.houseId, houseId)
      )
    )
    .orderBy(scoreBet.createdAt);

  const winner = bets.find(
    (bet) =>
      bet.homeGoals.toString() === betYesterday?.fixtures.homeGoals &&
      bet.awayGoals.toString() === betYesterday?.fixtures.awayGoals
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{"Yesterday's Winner"}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        {winner && betYesterday ? (
          <Table>
            <TableBody>
              <MatchRow
                key={winner.id}
                matchId={winner.fixtureId || 0}
                homeImage={betYesterday.teams.image}
                homeName={betYesterday.teams.name}
                homeScore={winner.homeGoals.toString()}
                awayImage={betYesterday.teams2.image}
                awayName={betYesterday.teams2.name}
                awayScore={winner.awayGoals.toString()}
                displayName={
                  members?.find((m) => m.id === winner.voterId)?.name
                }
              />
            </TableBody>
          </Table>
        ) : (
          <div>{"No winner for yesterday's game"}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default YesterdayWinner;
