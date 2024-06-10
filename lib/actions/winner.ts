"use server";
import { db } from "@/drizzle/db";
import { winnerVotes } from "@/drizzle/schema";
import { stackServerApp } from "@/stack";

export const betWinner = async (teamId: number) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const team = await user.getSelectedTeam();
  if (!team) {
    throw new Error("Select a house first.");
  }
  try {
    await db.insert(winnerVotes).values({
      teamId,
      voterId: user.id,
      houseId: team.id,
    });
  } catch (error) {
    throw new Error("Team not found");
  }
};
