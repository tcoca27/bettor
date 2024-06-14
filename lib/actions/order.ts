"use server";

import { InsertUsersOrder, usersOrder } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const generateRandomOrder = (numberOfMembers: number) => {
  const positions = Array.from(
    { length: numberOfMembers },
    (_, index) => index
  );

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
};

export const createOrder = async (memberIds: string[], houseName: string) => {
  await db.delete(usersOrder).where(eq(usersOrder.houseId, houseName));
  const positions = generateRandomOrder(memberIds.length);

  const inserts: InsertUsersOrder[] = memberIds.map(
    (memberId: string, index: number) => ({
      houseId: houseName,
      userId: memberId,
      position: positions[index].toString(),
    })
  );
  await db.insert(usersOrder).values(inserts);
  revalidatePath("/admin");
};

export const updateOrder = async (memberIds: string[], houseName: string) => {
  memberIds.forEach(async (member: string, index: number) => {
    await db
      .update(usersOrder)
      .set({ position: (index + 1).toString() })
      .where(
        and(eq(usersOrder.houseId, houseName), eq(usersOrder.userId, member))
      );
  });
  revalidatePath("/admin");
};
