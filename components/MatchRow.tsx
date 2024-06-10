import React from "react";
import { TableRow, TableCell } from "./ui/table";
import Image from "next/image";
import { cn } from "@/lib/utils";

type MatchRowProps = {
  matchId: number;
  popularId?: number | null | undefined;
  homeImage: string;
  homeName: string;
  homeScore: string;
  awayImage: string;
  awayName: string;
  awayScore: string;
  displayName?: string | undefined | null;
};

const MatchRow = ({
  matchId,
  popularId,
  homeImage,
  homeName,
  homeScore,
  awayImage,
  awayName,
  awayScore,
  displayName,
}: MatchRowProps) => {
  return (
    <TableRow
      className={cn(
        matchId === popularId
          ? "!border-2 border-primary after:content-['Bettor'] after:font-semibold after:text-primary after:absolute after:right-0 after:bottom-0"
          : "",
        "relative"
      )}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <Image src={homeImage} alt={homeName} width={20} height={20} />
          {homeName}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <p>{homeScore}</p>-<p>{awayScore}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          {awayName}
          <Image src={awayImage} alt={awayName} width={20} height={20} />
        </div>
      </TableCell>
      {displayName && <TableCell>{displayName}</TableCell>}
    </TableRow>
  );
};

export default MatchRow;
