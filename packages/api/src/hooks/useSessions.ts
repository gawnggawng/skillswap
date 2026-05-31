import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import type {
  SkillSession,
  CreateSessionInput,
  SessionListParams,
  SessionStatus,
} from "@skillswap/types/session";
import type { PaginatedResponse } from "@skillswap/types/api";

export function useSessions(params?: SessionListParams) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.role) searchParams.set("role", params.role);
  if (params?.cursor) searchParams.set("cursor", params.cursor);
  if (params?.limit) searchParams.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () =>
      apiClient<PaginatedResponse<SkillSession>>(
        `/api/sessions?${searchParams.toString()}`
      ),
  });
}

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => apiClient<SkillSession>(`/api/sessions/${sessionId}`),
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSessionInput) =>
      apiClient<SkillSession>("/api/sessions", {
        method: "POST",
        body: input,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useAcceptSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient<SkillSession>(`/api/sessions/${sessionId}/accept`, {
        method: "PATCH",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useRejectSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      reason,
    }: {
      sessionId: string;
      reason?: string;
    }) =>
      apiClient<SkillSession>(`/api/sessions/${sessionId}/reject`, {
        method: "PATCH",
        body: { reason },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient<SkillSession>(`/api/sessions/${sessionId}/cancel`, {
        method: "PATCH",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useConfirmSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient<SkillSession>(`/api/sessions/${sessionId}/confirm`, {
        method: "PATCH",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useSessionToken(sessionId: string) {
  return useQuery({
    queryKey: ["sessions", sessionId, "token"],
    queryFn: () =>
      apiClient<{ token: string; roomId: string }>(
        `/api/sessions/${sessionId}/token`
      ),
    enabled: !!sessionId,
  });
}
