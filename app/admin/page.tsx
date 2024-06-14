import MemberOrderForm from "@/components/MemberOrderForm";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import React from "react";
import { db } from "@/drizzle/db";
import { usersOrder } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const ALLOWED_USER_IDS = [
  "8ee9087a-ad5c-4832-a050-8ea940748d36",
  "c7783624-c08b-4e4c-be91-ec5f35f10eaa",
];

const AdminPage = async () => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  if (ALLOWED_USER_IDS.includes(user.id) === false) {
    redirect("/");
  }
  const houses = await user.listTeams();
  let selectedHouse = await user.getSelectedTeam();
  if (!selectedHouse) {
    selectedHouse = houses[0];
  }

  const members = await stackServerApp
    .getTeam(selectedHouse.id)
    .then((team) => team?.listMembers())
    .then((members) =>
      members?.map((member) => ({
        id: member.userId,
        name: member.displayName,
      }))
    );

  const currentOrder = await db
    .select()
    .from(usersOrder)
    .where(eq(usersOrder.houseId, selectedHouse.id))
    .orderBy(usersOrder.position);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-4 py-8 max-sm:px-4">
      <h1>Admin Page</h1>
      <p>House: {selectedHouse.displayName}</p>
      <p>Members: {members?.map((m) => m.name).join(", ")}</p>
      <MemberOrderForm
        members={members}
        currentOrder={currentOrder}
        houseId={selectedHouse.id}
      />
    </main>
  );
};

export default AdminPage;
