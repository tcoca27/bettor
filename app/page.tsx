import GroupTable from "@/components/GroupTable";
import TodaysFixtures from "@/components/TodaysFixtures";
import TopScorers from "@/components/TopScorers";
import { db } from "@/drizzle/db";
import { teams } from "@/drizzle/schema";

export default async function Home() {
  const groups = await db
    .selectDistinct({ group: teams.group })
    .from(teams)
    .orderBy(teams.group);
  const dbTeams = await db.select().from(teams);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex max-w-5xl flex-col gap-4 font-mono text-sm lg:flex-row">
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
        <div className="flex flex-col gap-4 text-center">
          <h3 className="text-lg font-bold">Details</h3>
          <TopScorers />
          <TodaysFixtures />
        </div>
      </div>
    </main>
  );
}
