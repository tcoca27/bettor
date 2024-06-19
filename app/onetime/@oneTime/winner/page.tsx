import React, { Suspense } from "react";
import { db } from "@/drizzle/db";
import { teams, winnerVotes } from "@/drizzle/schema";
import SelectWinnerForm from "@/components/SelectWinnerForm";
import {
  CardTitle,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { stackServerApp } from "@/stack";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExpiredCategory from "@/components/ExpiredCategory";

const WinnerPage = async () => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const houses = await user.listTeams();
  if (houses.length === 0) {
    redirect("/join-house");
  }
  let selectedHouse = await user.getSelectedTeam();
  if (!selectedHouse) {
    selectedHouse = houses[0];
  }
  const dbTeams = await db.select().from(teams);
  const votes = await db
    .select()
    .from(winnerVotes)
    .where(
      and(
        eq(winnerVotes.houseId, selectedHouse?.id),
        eq(winnerVotes.voterId, user.id)
      )
    );

  const ownVote = votes[0];
  let team;
  if (ownVote) {
    team = dbTeams.find((t) => t.id === ownVote.teamId);
  }

  const houseVotes = await db
    .select()
    .from(winnerVotes)
    .where(eq(winnerVotes.houseId, selectedHouse?.id));

  const members = await stackServerApp
    .getTeam(selectedHouse.id)
    .then((team) => team?.listMembers());

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{ownVote ? "Your Bet" : "Choose Winner"}</CardTitle>
          <CardDescription>
            {ownVote
              ? "Your selection for the winner"
              : "Select the winner of the tournament"}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          {ownVote ? (
            <div className="mr-8 flex items-center gap-2 text-lg font-semibold">
              <Image
                src={team?.image || ""}
                alt={team?.name || ""}
                width={20}
                height={20}
              ></Image>
              {team?.name}
            </div>
          ) : new Date() > new Date("2024-06-18") ? (
            <ExpiredCategory />
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <SelectWinnerForm teams={dbTeams} />
            </Suspense>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Other Bets in Your House</CardTitle>
          <CardDescription>
            See what other members of your house have bet on
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bet</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houseVotes.map((vote) => (
                <TableRow key={vote.id}>
                  <TableCell>
                    <div className="mr-8 flex items-center gap-2">
                      <Image
                        src={
                          dbTeams.find((t) => t.id === vote.teamId)?.image || ""
                        }
                        alt={"teamname"}
                        width={20}
                        height={20}
                      ></Image>
                      {dbTeams.find((t) => t.id === vote.teamId)?.name || ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {members?.find((m) => m.userId === vote.voterId)
                      ?.displayName || vote.voterId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WinnerPage;
