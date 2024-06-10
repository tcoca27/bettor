"use client";
import { SelectTeam } from "@/drizzle/schema";
import React, { useEffect } from "react";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { CardTitle, Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";

const GroupOrder = ({
  teams,
  groupName,
  updateGroupState,
}: {
  teams: SelectTeam[];
  groupName: string;
  updateGroupState: (groupName: string, groupState: any) => void;
}) => {
  const [items, setItems] = React.useState([...teams]);

  useEffect(() => {
    updateGroupState(groupName, items);
  }, [items, groupName, updateGroupState]);

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };
  const handleDragOver = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };
  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    const dragIndex = e.dataTransfer.getData("text/plain");
    const updatedItems = [...items];
    const [removedItem] = updatedItems.splice(parseInt(dragIndex), 1);
    updatedItems.splice(index, 0, removedItem);
    setItems(updatedItems);
  };
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedItems = [...items];
      const [removedItem] = updatedItems.splice(index, 1);
      updatedItems.splice(index - 1, 0, removedItem);
      setItems(updatedItems);
    }
  };
  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      const updatedItems = [...items];
      const [removedItem] = updatedItems.splice(index, 1);
      updatedItems.splice(index + 1, 0, removedItem);
      setItems(updatedItems);
    }
  };
  return (
    <Card className="h-[390px] w-[405px] max-sm:w-[360px]">
      <CardHeader>
        <CardTitle>{groupName}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <Table>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="cursor-move"
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="mr-8 flex items-center gap-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={20}
                      height={20}
                    ></Image>
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUpIcon className="size-4" />
                    <span className="sr-only">Move up</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                  >
                    <ArrowDownIcon className="size-4" />
                    <span className="sr-only">Move down</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GroupOrder;
