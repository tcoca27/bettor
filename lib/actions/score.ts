"use server";

import { db } from "@/drizzle/db";
import { stackServerApp } from "@/stack";
import { scoreBet } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

export const handleScoreBet = async (
  fixtureId: number,
  homeScore: number,
  awayScore: number
) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const house = await user.getSelectedTeam();
  if (!house) {
    throw new Error("Select a house first.");
  }
  try {
    await db.insert(scoreBet).values({
      fixtureId,
      homeGoals: homeScore,
      awayGoals: awayScore,
      voterId: user.id,
      houseId: house.id,
    });
    revalidatePath("/ongoing");
  } catch (error) {
    throw new Error("Fixture not found");
  }
};
