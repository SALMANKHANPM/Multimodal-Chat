"use client";

import { useRouter } from "next/navigation";
import { redirectTo } from "@/lib/utils";

/**
 * Custom hook for navigation with predefined routes
 */
export function useNavigation() {
  const router = useRouter();

  const navigate = {
    toDashboard: () => router.push(redirectTo.dashboard()),
    toProfile: () => router.push(redirectTo.profile()),
    toChat: () => router.push(redirectTo.chat()),
    toLogin: () => router.push(redirectTo.login()),
    toSignup: () => router.push(redirectTo.signup()),
    to: (path: string) => router.push(path),
    back: () => router.back(),
    forward: () => router.forward(),
    replace: (path: string) => router.replace(path),
    refresh: () => router.refresh(),
  };

  return navigate;
}

/**
 * Hook for immediate redirect to profile (useful for conditional redirects)
 */
export function useRedirectToProfile() {
  const router = useRouter();

  const redirectToProfile = () => {
    router.push(redirectTo.profile());
  };

  return redirectToProfile;
}
