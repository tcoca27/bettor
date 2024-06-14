"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Table, TableBody } from "./ui/table";
import MatchRow from "./MatchRow";
import { SelectFixture, SelectTeam, SelectScoreBet } from "@/drizzle/schema";
import { UserInfo } from "@/types";

const OtherBets = ({
  betToday,
  bets,
  members,
}: {
  betToday: {
    fixtures: SelectFixture;
    teams: SelectTeam;
    teams2: SelectTeam;
  };
  bets: SelectScoreBet[];
  members: UserInfo[] | null | undefined;
}) => {
  return (
    <Card className="h-fit px-8">
      <CardHeader>
        <CardTitle>{"Today's Bet"}</CardTitle>
        <CardDescription>
          {"What people have predicted for today's match"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {bets.map((bet) => (
              <MatchRow
                key={bet.id}
                matchId={betToday.fixtures.id}
                homeImage={betToday.teams.image}
                homeName={betToday.teams.name}
                homeScore={bet.homeGoals.toString()}
                awayImage={betToday.teams2.image}
                awayName={betToday.teams2.name}
                awayScore={bet.awayGoals.toString()}
                displayName={members?.find((m) => m.id === bet.voterId)?.name}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OtherBets;
