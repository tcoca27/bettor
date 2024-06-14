"use server";
import { db } from "@/drizzle/db";
import { topScorerBet } from "@/drizzle/schema";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";

export const betScorer = async (value: { scorer: string; image: string }) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const team = await user.getSelectedTeam();
  if (!team) {
    throw new Error("Select a house first.");
  }
  try {
    await db.insert(topScorerBet).values({
      voterId: user.id,
      houseId: team.id,
      scorerName: value.scorer,
      image: value.image,
    });
    revalidatePath("/onetime/scorer");
  } catch (error) {
    throw new Error("Team not found");
  }
};
