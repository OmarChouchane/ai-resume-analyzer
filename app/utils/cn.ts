// Tailwind Merge cn utility
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(
    inputs
      .flat(Infinity)
      .filter(Boolean)
      .join(' ')
  );
}
