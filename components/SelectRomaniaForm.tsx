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
import { betRomania } from "@/lib/actions/romania";

const formSchema = z.object({
  prediction: z.enum([
    "Group Stage",
    "Round of 16",
    "Quarter Finals",
    "Semi Finals",
    "Finals",
  ]),
});

const PredictionStages = formSchema.shape.prediction._def.values;

const SelectScorerForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await betRomania(values.prediction);
    } catch (error) {
      form.setError("prediction", {
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
            name="prediction"
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
                        {field.value ? <>{field.value}</> : "Select Stage"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search stage..." />
                      <CommandList>
                        <CommandEmpty>No stage found.</CommandEmpty>
                        <CommandGroup>
                          {PredictionStages.map((stage) => (
                            <CommandItem
                              value={stage}
                              key={stage}
                              onSelect={() => {
                                form.setValue("prediction", stage);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  stage === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {stage}
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
