import { fixtureVotes, fixtures, teams } from "@/drizzle/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import React from "react";
import PickTomorrowForm from "@/components/PickTomorrowForm";
import { alias } from "drizzle-orm/pg-core";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

const OngoingPage = async () => {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const houses = await user.listTeams();
  if (houses.length === 0) {
    redirect("/join-house");
  }
  let selectedHouse = await user.getSelectedTeam();
  if (!selectedHouse) {
    selectedHouse = houses[0];
  }
  const givenDate = new Date("2024-06-14");
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  tomorrow.setUTCHours(0);
  const toQuery = tomorrow > givenDate ? tomorrow : givenDate;
  const next = new Date(toQuery);
  next.setDate(toQuery.getDate() + 1);
  const teams2 = alias(teams, "teams2");
  const tomorrowFixtures = await db
    .select()
    .from(fixtures)
    .where(
      sql`
    date >= ${toQuery.toISOString()} AND date < ${next.toISOString()}
  `
    )
    .innerJoin(teams, eq(fixtures.homeTeam, teams.id))
    .innerJoin(teams2, eq(fixtures.awayTeam, teams2.id));

  const fixtureIds = tomorrowFixtures.map((fixture) => fixture.fixtures.id);
  const votes = await db
    .select()
    .from(fixtureVotes)
    .where(
      and(
        inArray(fixtureVotes.fixtureId, fixtureIds),
        and(
          eq(fixtureVotes.houseId, selectedHouse.id),
          eq(fixtureVotes.voterId, user.id)
        )
      )
    );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center py-8 max-sm:px-4">
      <PickTomorrowForm
        tomorrowFixtures={tomorrowFixtures}
        voted={votes.length > 0}
      ></PickTomorrowForm>
    </main>
  );
};

export default OngoingPage;
