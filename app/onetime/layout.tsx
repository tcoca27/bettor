import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const OneTimePageLayout = ({ oneTime }: { oneTime: React.ReactNode }) => {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center py-8 max-sm:px-4">
      <Tabs defaultValue="winner" className="w-full">
        <TabsList className="grid h-fit w-full grid-cols-4">
          <Link href={"/onetime/winner"} className="w-full">
            <TabsTrigger value="winner">Winner</TabsTrigger>
          </Link>
          <Link href={"/onetime/scorer"} className="w-full">
            <TabsTrigger value="scorer">Top Scorer</TabsTrigger>
          </Link>
          <Link href={"/onetime/groups"} className="w-full">
            <TabsTrigger value="groups">Groups Standings</TabsTrigger>
          </Link>
          <TabsTrigger value="romania">Romania</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-8">{oneTime}</div>
    </main>
  );
};

export default OneTimePageLayout;
