import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ableToVote = (usersToVote: number) => {
  const env = process.env.NODE_ENV;
  console.log("usersToVote", usersToVote);
  console.log("env", env);
  const today = new Date();
  if (env === "development") {
    today.setHours(10, 0, 0, 0);
  } else {
    today.setHours(7 + usersToVote, 0, 0, 0);
  }
  today.setHours(10 + usersToVote, 0, 0, 0);
  console.log(new Date(), today, new Date() > today);
  return new Date() > today;
};
