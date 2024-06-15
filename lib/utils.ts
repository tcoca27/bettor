import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ableToVote = (usersToVote: number) => {
  console.log("usersToVote", usersToVote);
  const today = new Date();
  today.setHours(10 + usersToVote, 0, 0, 0);
  console.log(new Date(), today, new Date() > today);
  return new Date() > today;
};
