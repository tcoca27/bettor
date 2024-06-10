"use server";
import { db } from "@/drizzle/db";
import { fixtureVotes } from "@/drizzle/schema";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";

export const votePopularFixture = async (fixtureId: number) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const team = await user.getSelectedTeam();
  if (!team) {
    throw new Error("Select a house first.");
  }
  try {
    await db.insert(fixtureVotes).values({
      fixtureId,
      voterId: user.id,
      houseId: team.id,
    });
    revalidatePath("/onetime");
  } catch (error) {
    throw new Error("Fixture not found");
  }
};
