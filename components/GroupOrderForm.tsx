"use client";
import { SelectTeam } from "@/drizzle/schema";
import React, { useCallback, useState } from "react";
import GroupOrder from "./GroupOrder";
import { Button } from "./ui/button";
import { betGroups } from "@/lib/actions/group";

const GroupOrderForm = ({
  groups,
  dbTeams,
}: {
  groups: { group: string }[];
  dbTeams: SelectTeam[];
}) => {
  const [groupStates, setGroupStates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateGroupState = useCallback((groupName: string, groupState: any) => {
    setGroupStates((prevStates) => ({
      ...prevStates,
      [groupName]: groupState,
    }));
  }, []);

  const submitOrder = async () => {
    setIsSubmitting(true);
    await betGroups(groupStates);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full justify-between">
        Order the group stage:
        <Button onClick={submitOrder} disabled={isSubmitting} className="w-fit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-center">
        {groups.map((group) => (
          <GroupOrder
            key={group.group}
            groupName={group.group}
            teams={dbTeams.filter((team) => team.group === group.group)}
            updateGroupState={updateGroupState}
          />
        ))}
      </div>
      <Button onClick={submitOrder} disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default GroupOrderForm;
