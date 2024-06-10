import { db } from "@/drizzle/db";
import {
  InsertScorer,
  InsertTeam,
  teams,
  scorers,
  InsertFixture,
  fixtures,
} from "@/drizzle/schema";
import { NextResponse } from "next/server";

const updateTeams = async () => {
  const response = await fetch(
    `https://apiv3.apifootball.com/?action=get_standings&league_id=1&APIkey=${process.env.API_FOOTBALL_KEY}`,
    {
      cache: "no-store",
    }
  );
  const teamsResponse = await response.json();
  const inserts: InsertTeam[] = teamsResponse
    .filter((team: any) => team.league_round.startsWith("Group"))
    .map((team: any) => ({
      id: parseInt(team.team_id),
      name: team.team_name,
      group: team.league_round,
      position: team.overall_league_position,
      points: team.overall_league_PTS,
      image: team.team_badge,
      apiId: team.team_id,
      played: team.overall_league_payed,
      wins: team.overall_league_W,
      draws: team.overall_league_D,
      losses: team.overall_league_L,
      goalDif: team.overall_league_GF - team.overall_league_GA,
    }));

  for (const team of inserts) {
    await db
      .insert(teams)
      .values(team)
      .onConflictDoUpdate({ target: teams.id, set: team });
  }
};

const updateScorers = async () => {
  const response = await fetch(
    `https://apiv3.apifootball.com/?action=get_topscorers&league_id=1&APIkey=${process.env.API_FOOTBALL_KEY}`,
    {
      cache: "no-store",
    }
  );
  const scorersResponse = await response.json();

  await db.delete(scorers);

  const inserts: InsertScorer[] = scorersResponse
    .filter(
      (scorer: any) => scorer.player_place <= 5 && scorer.team_key !== "17"
    )
    .map((scorer: any) => ({
      name: scorer.player_name,
      goals: scorer.goals,
      teamKey: parseInt(scorer.team_key),
    }));

  await db.insert(scorers).values(inserts);
};

const updateFixtures = async () => {
  const todaysDate = new Date();
  const year = todaysDate.getFullYear();
  const month = String(todaysDate.getMonth() + 1).padStart(2, "0");
  const day = String(todaysDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const response = await fetch(
    `https://apiv3.apifootball.com/?action=get_events&from=${formattedDate}&to=2024-09-11&league_id=1&APIkey=${process.env.API_FOOTBALL_KEY}`,
    {
      cache: "no-store",
    }
  );
  const fixturesResponse = await response.json();
  const inserts: InsertFixture[] = fixturesResponse.map((fixture: any) => {
    const matchDate = new Date(fixture.match_date);
    const hours = parseInt(fixture.match_time.split(":")[0]);
    matchDate.setUTCHours(hours + 1);
    return {
      id: parseInt(fixture.match_id),
      homeTeam: parseInt(fixture.match_hometeam_id),
      awayTeam: parseInt(fixture.match_awayteam_id),
      homeGoals: fixture.match_hometeam_score,
      awayGoals: fixture.match_awayteam_score,
      date: matchDate,
    };
  });

  for (const fixture of inserts) {
    await db
      .insert(fixtures)
      .values(fixture)
      .onConflictDoUpdate({ target: fixtures.id, set: fixture });
  }
};

export const GET = async () => {
  await updateTeams();
  await updateScorers();
  await updateFixtures();
  return new NextResponse("Success", {
    status: 200,
  });
};
