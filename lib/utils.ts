import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatAddress(address: string | null): string {
  if (!address) return "Unknown"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
