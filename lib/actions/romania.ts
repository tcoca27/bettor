"use server";
import { db } from "@/drizzle/db";
import { romaniaBet } from "@/drizzle/schema";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";

export const betRomania = async (prediction: string) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const team = await user.getSelectedTeam();
  if (!team) {
    throw new Error("Select a house first.");
  }
  try {
    await db.insert(romaniaBet).values({
      voterId: user.id,
      houseId: team.id,
      prediction,
    });
    revalidatePath("/onetime/romania");
  } catch (error) {
    throw new Error("Team not found");
  }
};
