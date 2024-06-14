"use client";
import { SelectUsersOrder } from "@/drizzle/schema";
import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { createOrder, updateOrder } from "@/lib/actions/order";
import MemberOrder from "./MemberOrder";

const MemberOrderForm = ({
  members,
  currentOrder,
  houseId,
}: {
  members: { id: string; name: string | null }[] | undefined;
  currentOrder: SelectUsersOrder[] | undefined;
  houseId: string;
}) => {
  const [orderState, setOrderState] = useState(
    currentOrder ? currentOrder.map((order) => order.userId) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateOrderState = useCallback((newOrder: string[]) => {
    setOrderState(newOrder);
  }, []);

  const submitOrder = async () => {
    setIsSubmitting(true);
    await updateOrder(orderState, houseId);
    setIsSubmitting(false);
  };

  const generateOrder = async () => {
    await createOrder(members?.map((m) => m.id) || [], houseId);
  };

  if (!currentOrder || currentOrder.length === 0)
    return <Button onClick={generateOrder}>Create Order</Button>;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full justify-between">
        Order the group stage:
        <Button onClick={submitOrder} disabled={isSubmitting} className="w-fit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-center">
        <MemberOrder
          members={members}
          currentOrder={currentOrder}
          updateOrderState={updateOrderState}
        ></MemberOrder>
      </div>
      <Button onClick={submitOrder} disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default MemberOrderForm;
