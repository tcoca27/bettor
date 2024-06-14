import { groupOrder, teams } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import React from "react";
import GroupOrderForm from "@/components/GroupOrderForm";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import GroupOrderDisplay from "@/components/GroupOrderDisplay";

const GroupStandingsPage = async () => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const houses = await user.listTeams();
  if (houses.length === 0) {
    redirect("/join-house");
  }
  let selectedHouse = await user.getSelectedTeam();
  if (!selectedHouse) {
    selectedHouse = houses[0];
  }
  const groups = await db
    .selectDistinct({ group: teams.group })
    .from(teams)
    .orderBy(teams.group);
  const dbTeams = await db.select().from(teams);
  const groupVotes = await db
    .select()
    .from(groupOrder)
    .where(
      and(
        eq(groupOrder.houseId, selectedHouse?.id),
        eq(groupOrder.voterId, user.id)
      )
    )
    .innerJoin(teams, eq(groupOrder.teamId, teams.id))
    .orderBy(groupOrder.position);

  return (
    <>
      {groupVotes.length > 0 ? (
        <GroupOrderDisplay groupVotes={groupVotes} groups={groups} />
      ) : (
        <GroupOrderForm groups={groups} dbTeams={dbTeams} />
      )}
    </>
  );
};

export default GroupStandingsPage;
