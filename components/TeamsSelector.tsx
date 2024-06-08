"use client";
import { useUser } from "@stackframe/stack";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TeamsSelector = () => {
  const user = useUser({ or: "redirect" });
  const teams = user.useTeams();

  return teams.length > 0 ? (
    <>
      <Select>
        <SelectTrigger>
          <SelectValue
            placeholder="Select House"
            defaultValue={user.useSelectedTeam()?.displayName}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="cursor-pointer">
            {teams.map((team) => (
              <SelectItem
                key={team.id}
                value={team.displayName}
                onClick={() => user.updateSelectedTeam(team)}
              >
                {team.displayName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  ) : (
    <Link href="join-house">
      <Button variant={"secondary"}>Join House</Button>
    </Link>
  );
};

export default TeamsSelector;
