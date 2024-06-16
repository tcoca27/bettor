"use server";

import { db } from "@/drizzle/db";
import { stackServerApp } from "@/stack";
import { SelectScoreBet, scoreBet, wildcards } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

export const handleScoreBet = async (
  fixtureId: number,
  homeScore: number,
  awayScore: number,
  bets: SelectScoreBet[],
  wildcard: boolean,
  wildcardsLeft: number
) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const house = await user.getSelectedTeam();
  if (!house) {
    throw new Error("Select a house first.");
  }
  if (
    bets.some(
      (bet) => bet.homeGoals === homeScore && bet.awayGoals === awayScore
    ) &&
    (!wildcard || wildcardsLeft === 0)
  ) {
    throw new Error("Score was already bet.");
  }
  if (wildcard) {
    await db.insert(wildcards).values({
      voterId: user.id,
      houseId: house.id,
      wildcards: "1",
      stage: "Groups",
    });
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
