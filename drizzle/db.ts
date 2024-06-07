import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { count, inArray } from "drizzle-orm";

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
    .limit(1);
};
