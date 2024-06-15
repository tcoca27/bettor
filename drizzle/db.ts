import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { count, inArray, and, eq, desc } from "drizzle-orm";

export const db = drizzle(sql, { schema });

export const getMostPopularMatch = async (fixtureIds: number[]) => {
  return db
    .select({
      id: schema.fixtureVotes.fixtureId,
      votes: count(schema.fixtureVotes.id),
    })
    .from(schema.fixtureVotes)
    .where(inArray(schema.fixtureVotes.fixtureId, fixtureIds))
    .groupBy(schema.fixtureVotes.fixtureId)
    .orderBy(({ votes }) => desc(votes))
    .limit(1);
};

export const getMostPopularMatchByHouse = async (
  fixtureIds: number[],
  houseId: string
) => {
  return db
    .select({
      id: schema.fixtureVotes.fixtureId,
      votes: count(schema.fixtureVotes.id),
    })
    .from(schema.fixtureVotes)
    .where(
      and(
        eq(schema.fixtureVotes.houseId, houseId),
        inArray(schema.fixtureVotes.fixtureId, fixtureIds)
      )
    )
    .groupBy(schema.fixtureVotes.fixtureId)
    .orderBy(({ votes }) => desc(votes))
    .limit(1);
};
