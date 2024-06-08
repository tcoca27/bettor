"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleJoinHouse } from "@/lib/actions/user";

const formSchema = z.object({
  houseName: z.string().min(2, {
    message: "House name must be at least 2 characters.",
  }),
});

const JoinTeamForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await handleJoinHouse(values.houseName);
    } catch (error) {
      form.setError("houseName", {
        message: "Team not found",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-12">
          <FormField
            control={form.control}
            name="houseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>House Name</FormLabel>
                <FormControl>
                  <Input placeholder="House Name" {...field} />
                </FormControl>
                <FormDescription>
                  Input the betting house name you want to join. It should be an
                  existing house name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {!form.formState.isSubmitting ? "Submit" : "Submitting..."}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JoinTeamForm;
