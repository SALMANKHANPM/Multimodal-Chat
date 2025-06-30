import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Redirect utility functions
 */
export const redirectTo = {
  dashboard: () => "/dashboard",
  profile: () => "/dashboard/profile",
  chat: () => "/dashboard/chat",
  login: () => "/login",
  signup: () => "/signup",
} as const;

/**
 * Client-side redirect function
 * @param path - The path to redirect to
 */
export function navigateTo(path: string) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}
