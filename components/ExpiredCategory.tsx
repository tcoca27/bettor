import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ExpiredCategory = () => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{"Betting Ended"}</CardTitle>
      </CardHeader>
      <CardContent>
        <h1>{"Betting has ended for this category"}</h1>
      </CardContent>
    </Card>
  );
};

export default ExpiredCategory;
