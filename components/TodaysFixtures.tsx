"use server";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody } from "./ui/table";
import { Separator } from "./ui/separator";
import { db, getMostPopularMatch } from "@/drizzle/db";
import { fixtures, teams } from "@/drizzle/schema";
import { inArray, sql } from "drizzle-orm";
import MatchRow from "./MatchRow";

const TodaysFixtures = async () => {
  const givenDateString = "2024-06-14";
  const givenDate = new Date(givenDateString);
  const todaysDate = new Date() > givenDate ? new Date() : givenDate;
  todaysDate.setUTCHours(0);
  const tomorrow = new Date(todaysDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todaysFixtures = await db.select().from(fixtures).where(sql`
    date >= ${todaysDate.toISOString()} AND date < ${tomorrow.toISOString()}
  `);

  const teamIds = todaysFixtures
    .map((fixture) => [fixture.homeTeam, fixture.awayTeam])
    .flat();

  if (teamIds.length === 0) return null;

  const dbTeams = await db
    .select()
    .from(teams)
    .where(inArray(teams.id, Array.from(teamIds) as number[]));

  const popular = await getMostPopularMatch(
    todaysFixtures.map((fixture) => fixture.id)
  );
  const popularId = popular[0]?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{"Today's Fixtures"}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        <Table>
          <TableBody>
            {todaysFixtures.map((match) => {
              return (
                <MatchRow
                  key={match.id}
                  matchId={match.id}
                  popularId={popularId}
                  homeImage={
                    dbTeams.find((team) => team.id === match.homeTeam)?.image ||
                    ""
                  }
                  homeName={
                    dbTeams.find((team) => team.id === match.homeTeam)?.name ||
                    ""
                  }
                  homeScore={match.homeGoals || ""}
                  awayScore={match.awayGoals || ""}
                  awayImage={
                    dbTeams.find((team) => team.id === match.awayTeam)?.image ||
                    ""
                  }
                  awayName={
                    dbTeams.find((team) => team.id === match.awayTeam)?.name ||
                    ""
                  }
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TodaysFixtures;
