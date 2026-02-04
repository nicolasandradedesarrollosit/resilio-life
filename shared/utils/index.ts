import type { UserData } from "@/shared/types";

export const getRedirectPath = (user: UserData): string => {
  if (user.role === "Business") return "/business";
  if (user.isAdmin) return "/admin";
  return "/user";
};
