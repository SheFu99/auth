import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const microserviceEndpoint = `${process.env.S3_MICRO_SERVICE_DOMAIN||''}` as string