import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const regexUrl = /^https?:\/\/www\.[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/;
