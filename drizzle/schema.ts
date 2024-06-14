import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";

export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    group: text("group").notNull(),
    position: text("position").notNull(),
    points: text("points").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    apiId: text("api_id").notNull(),
    played: text("played").notNull(),
    wins: text("wins").notNull(),
    draws: text("draws").notNull(),
    losses: text("losses").notNull(),
    goalDif: text("goal_diff").notNull(),
  },
  (teams) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(teams.apiId),
    };
  }
);

export type InsertTeam = typeof teams.$inferInsert;
export type SelectTeam = typeof teams.$inferSelect;

export const scorers = pgTable("scorers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  goals: text("goals").notNull(),
  teamKey: integer("team_key")
    .notNull()
    .references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsertScorer = typeof scorers.$inferInsert;
export type SelectScorer = typeof scorers.$inferSelect;

export const fixtures = pgTable("fixtures", {
  id: serial("id").primaryKey(),
  homeTeam: integer("home_team").references(() => teams.id),
  awayTeam: integer("away_team").references(() => teams.id),
  homeGoals: text("home_goals"),
  awayGoals: text("away_goals"),
  date: timestamp("date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsertFixture = typeof fixtures.$inferInsert;
export type SelectFixture = typeof fixtures.$inferSelect;

export const fixtureVotes = pgTable("fixture_votes", {
  id: serial("id").primaryKey(),
  fixtureId: integer("fixture_id").references(() => fixtures.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  voterId: text("voter_id").notNull(),
  houseId: text("house_id").notNull(),
});

export type InsertFixtureVote = typeof fixtureVotes.$inferInsert;
export type SelectFixtureVote = typeof fixtureVotes.$inferSelect;

export const winnerVotes = pgTable("winner_votes", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  voterId: text("voter_id").notNull(),
  houseId: text("house_id").notNull(),
});

export type InsertWinnerVote = typeof winnerVotes.$inferInsert;
export type SelectWinnerVote = typeof winnerVotes.$inferSelect;

export const groupOrder = pgTable("group_order", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  voterId: text("voter_id").notNull(),
  houseId: text("house_id").notNull(),
  group: text("group").notNull(),
  position: text("position").notNull(),
});

export type InsertGroupOrder = typeof groupOrder.$inferInsert;
export type SelectGroupOrder = typeof groupOrder.$inferSelect;

export const scoreBet = pgTable("score_bet", {
  id: serial("id").primaryKey(),
  homeGoals: integer("home_goals").notNull(),
  awayGoals: integer("away_goals").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  voterId: text("voter_id").notNull(),
  houseId: text("house_id").notNull(),
  fixtureId: integer("fixture_id").references(() => fixtures.id),
});

export type InsertScoreBet = typeof scoreBet.$inferInsert;
export type SelectScoreBet = typeof scoreBet.$inferSelect;

export const usersOrder = pgTable("users_order", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: text("user_id").notNull(),
  houseId: text("house_id").notNull(),
  position: integer("position").notNull(),
});

export type InsertUsersOrder = typeof usersOrder.$inferInsert;
export type SelectUsersOrder = typeof usersOrder.$inferSelect;

export const topScorerBet = pgTable("top_scorer_bet", {
  id: serial("id").primaryKey(),
  scorerName: text("scorer_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  voterId: text("voter_id").notNull(),
  houseId: text("house_id").notNull(),
  image: text("image").notNull(),
});

export type InsertTopScorerBet = typeof topScorerBet.$inferInsert;
export type SelectTopScorerBet = typeof topScorerBet.$inferSelect;

export const romaniaBet = pgTable("romania_bet", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  voterId: text("voter_id").notNull(),
  houseId: text("house_id").notNull(),
  prediction: text("prediction").notNull(),
});

export type InsertRomaniaBet = typeof romaniaBet.$inferInsert;
export type SelectRomaniaBet = typeof romaniaBet.$inferSelect;
