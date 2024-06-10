"use client";
import { useUser } from "@stackframe/stack";
import React, { useEffect } from "react";
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
import { useRouter } from "next/navigation";

const TeamsSelector = () => {
  const user = useUser({ or: "redirect" });
  const teams = user.useTeams();
  const selected = user.useSelectedTeam();
  const [selectedTeam, setSelectedTeam] = React.useState<string | null>(
    selected
      ? selected.displayName
      : teams.length > 0
        ? teams[0].displayName
        : null
  );
  useEffect(() => {
    if (!selected && teams.length > 0) {
      user.updateSelectedTeam(teams[0]);
    }
  }, []);

  const router = useRouter();

  const updateSelectedTeam = async (value: string) => {
    const team = teams.find((team) => team.displayName === value);
    if (team) {
      setSelectedTeam(team.displayName);
      await user.updateSelectedTeam(team);
      router.refresh();
    }
  };

  return teams.length > 0 ? (
    <>
      <Select
        value={selectedTeam || ""}
        onValueChange={(value) => updateSelectedTeam(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={"Select House"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="cursor-pointer">
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.displayName}>
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
