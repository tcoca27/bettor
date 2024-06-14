import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SelectUsersOrder } from "@/drizzle/schema";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";

const TodaysOrder = ({
  members,
  userOrder,
}: {
  members: { id: string; name: string | null }[] | undefined;
  userOrder: SelectUsersOrder[];
}) => {
  return (
    <Card className="h-fit px-8">
      <CardHeader>
        <CardTitle>{"Today's Order"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {userOrder.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {members?.find((m) => m.id === order.userId)?.name ||
                    order.userId}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TodaysOrder;
