"use server";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableRow, TableBody, TableCell } from "./ui/table";
import { Separator } from "./ui/separator";
import { db, getMostPopularMatch } from "@/drizzle/db";
import { fixtures, teams } from "@/drizzle/schema";
import { inArray, sql } from "drizzle-orm";
import Image from "next/image";
import { cn } from "@/lib/utils";

const TodaysFixtures = async () => {
  const givenDateString = "2024-06-14";
  const givenDate = new Date(givenDateString);
  const todaysDate = new Date() > givenDate ? new Date() : givenDate;
  const tomorrow = new Date(todaysDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todaysFixtures = await db.select().from(fixtures).where(sql`
    date >= ${todaysDate.toISOString()} AND date < ${tomorrow.toISOString()}
  `);

  const teamIds = todaysFixtures
    .map((fixture) => [fixture.homeTeam, fixture.awayTeam])
    .flat();

  const dbTeams = await db
    .select()
    .from(teams)
    .where(inArray(teams.id, Array.from(teamIds)));

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
                <TableRow
                  key={match.id}
                  className={cn(
                    match.id === popularId
                      ? "!border-2 border-primary after:content-['Bettor'] after:font-semibold after:text-primary after:absolute after:right-0 after:bottom-0"
                      : "",
                    "relative"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          dbTeams.find((team) => team.id === match.homeTeam)
                            ?.image || ""
                        }
                        alt={
                          dbTeams.find((team) => team.id === match.homeTeam)
                            ?.name || ""
                        }
                        width={20}
                        height={20}
                      />
                      {dbTeams.find((team) => team.id === match.homeTeam)?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <p>{match.homeGoals}</p>-<p>{match.awayGoals}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {dbTeams.find((team) => team.id === match.awayTeam)?.name}
                      <Image
                        src={
                          dbTeams.find((team) => team.id === match.awayTeam)
                            ?.image || ""
                        }
                        alt={
                          dbTeams.find((team) => team.id === match.awayTeam)
                            ?.name || ""
                        }
                        width={20}
                        height={20}
                      />
                    </div>
                  </TableCell>
                  {/* {match.id === popularId && (
                    <p className="absolute bottom-0 right-0 font-semibold text-primary">
                      Bettor
                    </p>
                  )} */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TodaysFixtures;
