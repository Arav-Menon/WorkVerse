import { useQuery } from "@tanstack/react-query";
import { fetchProfile, type UserProfile } from "@/lib/api/profile.api";

export function useCurrentUser() {
  const { data, isLoading, isError, error } = useQuery<UserProfile>({
    queryKey: ["currentUser"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  return { user: data ?? null, isLoading, isError, error };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
