import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { Review, CreateReviewInput, ReviewVisibility } from "@skillswap/types/review";

export function useSessionReviews(sessionId: string) {
  return useQuery({
    queryKey: ["reviews", sessionId],
    queryFn: () =>
      apiClient<{ myReview: Review | null; theirReview: Review | null }>(
        `/api/reviews/session/${sessionId}`
      ),
    enabled: !!sessionId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      apiClient<Review>("/api/reviews", {
        method: "POST",
        body: input,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.sessionId],
      });
    },
  });
}
