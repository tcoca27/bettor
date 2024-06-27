"use client";
import React from "react";
import { CardTitle, Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import Image from "next/image";

const GroupOrderDisplay = ({
  groupVotes,
  groups,
}: {
  groupVotes: any[];
  groups: { group: string }[];
}) => {
  return (
    <div className="flex flex-col text-center">
      <h1 className="mb-4 text-lg font-semibold">Your Selection</h1>
      <div className="flex flex-wrap justify-center gap-4 text-center">
        {groups.map((group) => {
          return (
            <Card
              key={group.group}
              className="h-[285px] w-[310px] max-sm:max-w-[360px]"
            >
              <CardHeader>
                <CardTitle>{group.group}</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <Table>
                  <TableBody>
                    {groupVotes
                      .filter(
                        (groupVote) =>
                          groupVote.group_order.group === group.group
                      )
                      .map((groupVote) => {
                        return (
                          <TableRow key={groupVote.group_order.id}>
                            <TableCell>
                              {groupVote.group_order.position}
                            </TableCell>
                            <TableCell>
                              <div className="mr-8 flex items-center gap-2">
                                <Image
                                  src={groupVote.teams.image || ""}
                                  alt={groupVote.teams.name}
                                  width={20}
                                  height={20}
                                ></Image>
                                {groupVote.teams.name}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GroupOrderDisplay;
