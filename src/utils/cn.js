import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge to produce a deduplicated,
 * conflict-resolved Tailwind CSS class string.
 *
 * @param {...import('clsx').ClassValue} inputs - Any number of class values
 *   accepted by clsx (strings, arrays, objects, falsy values).
 * @returns {string} Merged and deduplicated class string.
 *
 * @example
 * cn('px-4 py-2', condition && 'bg-blue-500', { 'text-white': true })
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export default cn;
