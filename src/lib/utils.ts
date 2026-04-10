import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const ADMIN_ID = "EYsRH8hFWpvZjJhWQmbK4esHNul76F41"
