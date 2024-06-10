"use client";
import { SelectFixture, SelectTeam } from "@/drizzle/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { votePopularFixture } from "@/lib/actions/popularFixture";

const FormSchema = z.object({
  fixtureId: z.string(),
});

const PickTomorrowForm = ({
  tomorrowFixtures,
  voted,
}: {
  tomorrowFixtures: {
    fixtures: SelectFixture;
    teams: SelectTeam;
    teams2: SelectTeam;
  }[];
  voted: boolean;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    await votePopularFixture(parseInt(values.fixtureId));
  };

  return (
    <Card className="h-fit px-8">
      <CardHeader>
        <CardTitle>{"Tomorrow's Bet"}</CardTitle>
        <CardDescription>
          {"Select the fixture you want to bet on"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {voted ? (
          <h1>
            Thanks for your pick! Come back tomorrow to select the next game
          </h1>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fixtureId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {tomorrowFixtures.map((fixture) => (
                          <FormItem
                            key={fixture.fixtures.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={fixture.fixtures.id.toString()}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={fixture.teams.image || ""}
                                  alt={fixture.teams.name}
                                  width={20}
                                  height={20}
                                />
                                {fixture.teams.name}
                                <p>vs</p>
                                <Image
                                  src={fixture.teams2.image || ""}
                                  alt={fixture.teams2.name}
                                  width={20}
                                  height={20}
                                />
                                {fixture.teams2.name}
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default PickTomorrowForm;
