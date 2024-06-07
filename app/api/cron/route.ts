import { db } from "@/drizzle/db";
import { InsertScorer, InsertTeam, teams, scorers } from "@/drizzle/schema";
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
  console.log(scorersResponse);

  await db.delete(scorers);

  const inserts: InsertScorer[] = scorersResponse
    .filter(
      (scorer: any) => scorer.player_place < 5 && scorer.team_key !== "17"
    )
    .map((scorer: any) => ({
      name: scorer.player_name,
      goals: scorer.goals,
      teamKey: parseInt(scorer.team_key),
    }));

  await db.insert(scorers).values(inserts);
};

export const GET = async () => {
  await updateTeams();
  await updateScorers();
  return new NextResponse("Success", {
    status: 200,
  });
};
