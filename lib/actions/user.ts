"use server";

import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

export const handleJoinHouse = async (houseName: string) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const teams = await stackServerApp.listTeams();

  const team = teams.find((team) => team.displayName === houseName);
  if (!team) {
    throw new Error("Team not found");
  }
  await team.addUser(user.id);

  redirect("/");
};
