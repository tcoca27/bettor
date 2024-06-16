import CardSkeleton from "@/components/skeletons/CardSkeleton";
import React from "react";

const loading = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 py-8 max-md:items-center max-sm:px-4 md:flex-row md:justify-center">
      <CardSkeleton />
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </main>
  );
};

export default loading;
