import { db } from "@/drizzle/db";
import { groupOrder, teams } from "@/drizzle/schema";
import { stackServerApp } from "@/stack";
import { ServerTeam } from "@stackframe/stack";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
  const orgs: ServerTeam[] | null = [];
  orgs.push(
    (await stackServerApp.getTeam(
      "81c57d6a-77e1-4b16-ae2b-2c73e634c865"
    )) as ServerTeam
  );
  orgs.push(
    (await stackServerApp.getTeam(
      "a7cc4362-8c0e-452e-aa34-78a63bca4b11"
    )) as ServerTeam
  );

  const dbTeams = await db.select().from(teams);

  orgs.forEach(async (org) => {
    const members = await org.listMembers();
    for (const member of members) {
      const voted = await db
        .select()
        .from(groupOrder)
        .where(
          and(
            eq(groupOrder.voterId, member.userId),
            eq(groupOrder.houseId, org.id)
          )
        );
      if (voted.length === 0) {
        continue;
      }
      let points = 0;
      voted.forEach((vote) => {
        const team = dbTeams.find((t) => t.id === vote.teamId);
        if (!team) {
          return;
        }
        points += vote.position === team.position ? 1 : 0;
      });
      if (points === 0) {
        continue;
      }
      await db
        .update(groupOrder)
        .set({ points })
        .where(
          and(
            eq(groupOrder.voterId, member.userId),
            eq(groupOrder.houseId, org.id)
          )
        );
    }
  });

  return new NextResponse("Success", {
    status: 200,
  });
};
