"use server";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Separator } from "./ui/separator";
import { db } from "@/drizzle/db";
import { scorers, teams } from "@/drizzle/schema";
import { desc, asc, inArray } from "drizzle-orm";
import Image from "next/image";

const TopScorers = async () => {
  const players = await db
    .select()
    .from(scorers)
    .orderBy(desc(scorers.goals), asc(scorers.name))
    .limit(5);

  const teamIds = new Set(players.map((player) => player.teamKey));
  const images = await db
    .select({
      id: teams.id,
      image: teams.image,
    })
    .from(teams)
    .where(inArray(teams.id, Array.from(teamIds)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Scorers</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Goals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="mr-8 flex items-center gap-2">
                    <Image
                      src={
                        images.find((image) => image.id === player.teamKey)
                          ?.image || ""
                      }
                      alt={player.name}
                      width={20}
                      height={20}
                    ></Image>
                    {player.name}
                  </div>
                </TableCell>
                <TableCell className="text-center">{player.goals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopScorers;
