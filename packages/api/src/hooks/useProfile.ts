import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { UserProfile, CreateSkillInput, UpdateAvailabilityInput } from "@skillswap/types/user";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient<UserProfile>("/api/profiles/me"),
  });
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () =>
      apiClient<UserProfile>(`/api/profiles/${userId}`),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; bio?: string; timezone?: string }) =>
      apiClient<UserProfile>("/api/profiles/me", {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSkillInput) =>
      apiClient<{ skills: UserProfile["skills"] }>("/api/profiles/me/skills", {
        method: "POST",
        body: input,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useRemoveSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) =>
      apiClient<void>(`/api/profiles/me/skills/${skillId}`, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAvailabilityInput) =>
      apiClient<UserProfile>("/api/profiles/me/availability", {
        method: "PUT",
        body: input,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}
