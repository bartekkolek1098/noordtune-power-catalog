import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, locale = "nl-NL") {
  const amount = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0
  }).format(value);

  return `€${amount}`;
}
