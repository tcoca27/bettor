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
