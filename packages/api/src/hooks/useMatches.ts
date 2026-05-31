import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { MatchSuggestion, MatchDirectoryParams } from "@skillswap/types/match";
import type { PaginatedResponse } from "@skillswap/types/api";

export function useMatches(userId?: string) {
  return useQuery({
    queryKey: ["matches", userId],
    queryFn: () =>
      apiClient<MatchSuggestion[]>("/api/matches"),
    enabled: !!userId,
  });
}

export function useMatchDirectory(params?: MatchDirectoryParams) {
  const searchParams = new URLSearchParams();
  if (params?.skillTag) searchParams.set("skillTag", params.skillTag);
  if (params?.minTrustScore)
    searchParams.set("minTrustScore", String(params.minTrustScore));
  if (params?.timezone) searchParams.set("timezone", params.timezone);
  if (params?.cursor) searchParams.set("cursor", params.cursor);
  if (params?.limit) searchParams.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["match-directory", params],
    queryFn: () =>
      apiClient<PaginatedResponse<MatchSuggestion>>(
        `/api/matches/directory?${searchParams.toString()}`
      ),
  });
}
