import React, { Suspense } from "react";
import { db } from "@/drizzle/db";
import { romaniaBet } from "@/drizzle/schema";
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
import SelectRomaniaForm from "@/components/SelectRomaniaForm";

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
    .from(romaniaBet)
    .where(eq(romaniaBet.houseId, selectedHouse?.id));

  const ownBet = houseVotes.find((vote) => vote.voterId === user.id);

  const members = await stackServerApp
    .getTeam(selectedHouse.id)
    .then((team) => team?.listMembers());

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>
            {ownBet ? "Your Bet" : "Choose Prediction for Romania"}
          </CardTitle>
          <CardDescription>
            {ownBet
              ? "Your selection for Romania's progress"
              : "Select Romania's progress in the tournament"}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          {ownBet ? (
            <div className="mr-8 flex items-center gap-2 text-lg font-semibold">
              <Image
                src={"https://apiv3.apifootball.com/badges/702_romania.jpg"}
                alt={"Romania"}
                width={20}
                height={20}
              ></Image>
              {ownBet.prediction}
            </div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <SelectRomaniaForm />
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
                    <div className="mr-8 flex items-center gap-2 text-lg font-semibold">
                      <Image
                        src={
                          "https://apiv3.apifootball.com/badges/702_romania.jpg"
                        }
                        alt={"Romania"}
                        width={20}
                        height={20}
                      ></Image>
                      {vote.prediction}
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
