import { groupOrder, teams } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import React from "react";
import GroupOrderForm from "@/components/GroupOrderForm";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import GroupOrderDisplay from "@/components/GroupOrderDisplay";
import ExpiredCategory from "@/components/ExpiredCategory";
import GroupStandingsResults from "@/components/GroupStandingsResults";

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
    <div className="flex flex-col gap-4 md:flex-row">
      <GroupStandingsResults houseId={selectedHouse.id} />
      {groupVotes.length > 0 ? (
        <GroupOrderDisplay groupVotes={groupVotes} groups={groups} />
      ) : new Date() > new Date("2024-06-18") ? (
        <ExpiredCategory />
      ) : (
        <GroupOrderForm groups={groups} dbTeams={dbTeams} />
      )}
    </div>
  );
};

export default GroupStandingsPage;
