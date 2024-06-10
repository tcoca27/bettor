"use client";
import { SelectFixture, SelectScoreBet, SelectTeam } from "@/drizzle/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { handleScoreBet } from "@/lib/actions/score";
import { Table, TableBody } from "./ui/table";
import MatchRow from "./MatchRow";
import { UserInfo } from "@/types";

const FormSchema = z.object({
  homeScore: z.coerce.number().nonnegative(),
  awayScore: z.coerce.number().nonnegative(),
});

const TodaysScore = ({
  betToday,
  ownBet,
  bets,
  members,
}: {
  betToday: {
    fixtures: SelectFixture;
    teams: SelectTeam;
    teams2: SelectTeam;
  };
  ownBet: boolean;
  bets: SelectScoreBet[];
  members: UserInfo[] | null | undefined;
}) => {
  const isPassed = betToday.fixtures.date
    ? betToday.fixtures.date < new Date()
    : false;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      homeScore: 0,
      awayScore: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    await handleScoreBet(
      betToday.fixtures.id,
      values.homeScore,
      values.awayScore
    );
  };

  useEffect(() => {
    console.log(">>>", ownBet, isPassed);
  }, []);

  return (
    <Card className="h-fit px-8">
      <CardHeader>
        <CardTitle>{"Today's Bet"}</CardTitle>
        <CardDescription>
          {"Predict the score of today's match"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ownBet || isPassed ? (
          <Table>
            <TableBody>
              {bets.map((bet) => (
                <MatchRow
                  key={bet.id}
                  matchId={betToday.fixtures.id}
                  homeImage={betToday.teams.image}
                  homeName={betToday.teams.name}
                  homeScore={bet.homeGoals.toString()}
                  awayImage={betToday.teams2.image}
                  awayName={betToday.teams2.name}
                  awayScore={bet.awayGoals.toString()}
                  displayName={members?.find((m) => m.id === bet.voterId)?.name}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <FormField
                  control={form.control}
                  name="homeScore"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <FormLabel className="font-normal">
                            <div className="flex items-center gap-2">
                              <Image
                                src={betToday.teams.image || ""}
                                alt={betToday.teams.name}
                                width={20}
                                height={20}
                              />
                              {betToday.teams.name}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0"
                              type="number"
                              {...field}
                              className="!my-0 w-16"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="max-w-[200px]" />
                      </div>
                    </FormItem>
                  )}
                />
                vs
                <FormField
                  control={form.control}
                  name="awayScore"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 max-sm:flex-row-reverse">
                      <div>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder="0"
                              type="number"
                              {...field}
                              className="!my-0 w-16"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center gap-2">
                              <Image
                                src={betToday.teams2.image || ""}
                                alt={betToday.teams2.name}
                                width={20}
                                height={20}
                              />
                              {betToday.teams2.name}
                            </div>
                          </FormLabel>
                        </div>
                        <FormMessage className="max-w-[200px]" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysScore;
