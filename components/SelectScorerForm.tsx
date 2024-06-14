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
import players from "@/constants/topScorers.json";
import { betScorer } from "@/lib/actions/scorer";

const formSchema = z.object({
  scorer: z.string(),
  image: z.string(),
});

const SelectScorerForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await betScorer(values);
    } catch (error) {
      form.setError("scorer", {
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
            name="scorer"
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
                        {field.value ? <>{field.value}</> : "Select Winner"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search player..." />
                      <CommandList>
                        <CommandEmpty>No players found.</CommandEmpty>
                        <CommandGroup>
                          {players.map((player) => (
                            <CommandItem
                              value={player.name}
                              key={player.name}
                              onSelect={() => {
                                form.setValue("scorer", player.name);
                                form.setValue("image", player.badge);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  player.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <Image
                                className="mr-2"
                                src={player.badge}
                                alt={player.name}
                                width={20}
                                height={20}
                              ></Image>
                              {player.name}
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

export default SelectScorerForm;
