import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to cleanly merge tailwind classes
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
