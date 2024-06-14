import React, { Suspense } from "react";
import { db } from "@/drizzle/db";
import { topScorerBet } from "@/drizzle/schema";
import {
  CardTitle,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
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
import SelectScorerForm from "@/components/SelectScorerForm";

const ScorerPage = async () => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const houses = await user.listTeams();
  if (houses.length === 0) {
    redirect("/join-house");
  }
  let selectedHouse = await user.getSelectedTeam();
  if (!selectedHouse) {
    selectedHouse = houses[0];
  }

  const houseVotes = await db
    .select()
    .from(topScorerBet)
    .where(eq(topScorerBet.houseId, selectedHouse?.id));

  const ownBet = houseVotes.find((vote) => vote.voterId === user.id);

  const members = await stackServerApp
    .getTeam(selectedHouse.id)
    .then((team) => team?.listMembers());

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{ownBet ? "Your Bet" : "Choose Top Scorer"}</CardTitle>
          <CardDescription>
            {ownBet
              ? "Your selection for the top scorer"
              : "Select the top scorer of the tournament"}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          {ownBet ? (
            <div className="mr-8 flex items-center gap-2 text-lg font-semibold">
              <Image
                src={ownBet.image || ""}
                alt={ownBet.scorerName || ""}
                width={20}
                height={20}
              ></Image>
              {ownBet.scorerName}
            </div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <SelectScorerForm />
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
                        src={vote.image}
                        alt={vote.scorerName}
                        width={20}
                        height={20}
                      ></Image>
                      {vote.scorerName}
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

export default ScorerPage;
