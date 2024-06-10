"use server";

import { InsertGroupOrder, SelectTeam, groupOrder } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";

export const betGroups = async (groupStates: {
  [key: string]: SelectTeam[];
}) => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const house = await user.getSelectedTeam();
  if (!house) {
    throw new Error("Select a house first.");
  }
  for (const group in groupStates) {
    const teams = groupStates[group];
    const groupVotes: InsertGroupOrder[] = teams.map((team, index) => ({
      teamId: team.id,
      group,
      position: (index + 1).toString(),
      voterId: user.id,
      houseId: house.id,
    }));
    await db.insert(groupOrder).values(groupVotes);
    revalidatePath("/onetime/groups");
  }
};
