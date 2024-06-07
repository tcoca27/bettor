import { SelectTeam } from "@/drizzle/schema";
import React from "react";
import { CardTitle, Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const GroupTable = ({
  teams,
  groupName,
}: {
  teams: SelectTeam[];
  groupName: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{groupName}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Played</TableHead>
              <TableHead className="max-sm:hidden">Wins</TableHead>
              <TableHead className="max-md:hidden">Draws</TableHead>
              <TableHead className="max-md:hidden">Losses</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <div className="mr-8 flex items-center gap-2">
                    <Image
                      src={team.image}
                      alt={team.name}
                      width={20}
                      height={20}
                    ></Image>
                    {team.name}
                  </div>
                </TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center max-sm:hidden">
                  {team.wins}
                </TableCell>
                <TableCell className="text-center max-md:hidden">
                  {team.draws}
                </TableCell>
                <TableCell className="text-center max-md:hidden">
                  {team.losses}
                </TableCell>
                <TableCell className="text-center">{team.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GroupTable;
