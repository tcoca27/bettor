import CardSkeleton from "@/components/skeletons/CardSkeleton";
import React from "react";

const loading = () => {
  return (
    <main className="mx-auto flex max-w-5xl flex-col flex-wrap gap-4 py-8 max-md:items-center max-sm:px-4 md:flex-row md:justify-center">
      <CardSkeleton />
      <CardSkeleton />
    </main>
  );
};

export default loading;
