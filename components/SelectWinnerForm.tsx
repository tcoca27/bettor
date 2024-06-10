"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SelectTeam } from "@/drizzle/schema";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { betWinner } from "@/lib/actions/winner";

const formSchema = z.object({
  winner: z.number(),
});

const SelectWinnerForm = ({ teams }: { teams: SelectTeam[] }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await betWinner(values.winner);
    } catch (error) {
      form.setError("winner", {
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="winner"
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <>
                            <Image
                              src={
                                teams.find((team) => team.id === field.value)
                                  ?.image || ""
                              }
                              alt={"teamname"}
                              width={20}
                              height={20}
                            ></Image>
                            {
                              teams.find((team) => team.id === field.value)
                                ?.name
                            }
                          </>
                        ) : (
                          "Select Winner"
                        )}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search team..." />
                      <CommandList>
                        <CommandEmpty>No teams found.</CommandEmpty>
                        <CommandGroup>
                          {teams.map((team) => (
                            <CommandItem
                              value={team.name}
                              key={team.id}
                              onSelect={() => {
                                form.setValue("winner", team.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  team.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <Image
                                className="mr-2"
                                src={team.image}
                                alt={team.name}
                                width={20}
                                height={20}
                              ></Image>
                              {team.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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

export default SelectWinnerForm;
