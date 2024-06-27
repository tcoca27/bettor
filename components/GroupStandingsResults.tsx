import "server-only";
import React from "react";
import { groupOrder } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { desc, eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import { stackServerApp } from "@/stack";

const GroupStandingsResults = async ({ houseId }: { houseId: string }) => {
  const result = await db
    .selectDistinct({
      userId: groupOrder.voterId,
      points: groupOrder.points,
    })
    .from(groupOrder)
    .where(eq(groupOrder.houseId, houseId))
    .orderBy(({ points }) => desc(groupOrder.points));

  const org = await stackServerApp.getTeam(houseId);
  if (!org) return null;
  const members = await org.listMembers();

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Results of Group Stage Bets</CardTitle>
          <CardDescription>
            Results are in! Congrats to the winner(s)!
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map((vote, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {members?.find((m) => m.userId === vote.userId)
                      ?.displayName || vote.userId}
                  </TableCell>
                  <TableCell>{vote.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default GroupStandingsResults;
