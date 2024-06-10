import { fixtureVotes, fixtures, scoreBet, teams } from "@/drizzle/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db, getMostPopularMatchByHouse } from "@/drizzle/db";
import React from "react";
import PickTomorrowForm from "@/components/PickTomorrowForm";
import { alias } from "drizzle-orm/pg-core";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import TodaysScore from "@/components/TodaysScore";

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

  const gd = new Date("2024-06-14");
  const todaysDate = new Date() > gd ? new Date() : gd;
  todaysDate.setUTCHours(0);
  const tmr = new Date(todaysDate);
  tmr.setDate(tmr.getDate() + 1);
  const todaysFixtures = await db
    .select()
    .from(fixtures)
    .where(
      sql`
    date >= ${todaysDate.toISOString()} AND date < ${tmr.toISOString()}
  `
    )
    .innerJoin(teams, eq(fixtures.homeTeam, teams.id))
    .innerJoin(teams2, eq(fixtures.awayTeam, teams2.id));

  const fixture = await getMostPopularMatchByHouse(
    todaysFixtures.map((fixture) => fixture.fixtures.id),
    selectedHouse.id
  );
  const betToday = todaysFixtures.find((f) => f.fixtures.id === fixture[0]?.id);

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

  const ownBet = await db
    .select()
    .from(scoreBet)
    .where(
      and(
        eq(scoreBet.fixtureId, betToday?.fixtures.id),
        and(
          eq(scoreBet.houseId, selectedHouse.id),
          eq(scoreBet.voterId, user.id)
        )
      )
    );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 py-8 max-md:items-center max-sm:px-4 md:flex-row">
      <PickTomorrowForm
        tomorrowFixtures={tomorrowFixtures}
        voted={votes.length > 0}
      ></PickTomorrowForm>
      {betToday && (
        <TodaysScore betToday={betToday} ownBet={ownBet[0]}></TodaysScore>
      )}
    </main>
  );
};

export default OngoingPage;