import GroupTable from "@/components/GroupTable";
import TodaysFixtures from "@/components/TodaysFixtures";
import TopScorers from "@/components/TopScorers";
import TodaysFixturesSkeleton from "@/components/skeletons/TodaysFixturesSkeleton";
import { db } from "@/drizzle/db";
import { teams } from "@/drizzle/schema";
import { Suspense } from "react";

export default async function Home() {
  const groups = await db
    .selectDistinct({ group: teams.group })
    .from(teams)
    .orderBy(teams.group);
  const dbTeams = await db.select().from(teams).orderBy(teams.position);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="flex max-w-5xl flex-col gap-4 font-mono text-sm lg:flex-row">
        <div className="flex flex-col gap-4 text-center">
          <h3 className="text-lg font-bold">Details</h3>
          <Suspense fallback={<TodaysFixturesSkeleton />}>
            <TodaysFixtures />
          </Suspense>
          <TopScorers />
        </div>
        <div className="flex flex-col gap-4 text-center">
          <h3 className="text-lg font-bold">Group Stage Standings</h3>
          {groups.map((group) => (
            <GroupTable
              key={group.group}
              groupName={group.group}
              teams={dbTeams.filter((team) => team.group === group.group)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
