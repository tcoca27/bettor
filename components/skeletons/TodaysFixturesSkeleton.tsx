import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableRow, TableBody } from "../ui/table";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const TodaysFixturesSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{"Today's Fixtures"}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        <Table>
          <TableBody>
            <TableRow>
              <Skeleton className="h-4 w-[250px]" />
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TodaysFixturesSkeleton;
