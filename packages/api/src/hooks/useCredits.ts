import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { CreditBalance, CreditTransaction, CreditTransactionListParams } from "@skillswap/types/credit";
import type { PaginatedResponse } from "@skillswap/types/api";

export function useCreditBalance() {
  return useQuery({
    queryKey: ["credits", "balance"],
    queryFn: () => apiClient<CreditBalance>("/api/credits/balance"),
    refetchInterval: 30_000,
  });
}

export function useCreditTransactions(params?: CreditTransactionListParams) {
  const searchParams = new URLSearchParams();
  if (params?.cursor) searchParams.set("cursor", params.cursor);
  if (params?.limit) searchParams.set("limit", String(params.limit));

  return useQuery({
    queryKey: ["credits", "transactions", params],
    queryFn: () =>
      apiClient<PaginatedResponse<CreditTransaction>>(
        `/api/credits/transactions?${searchParams.toString()}`
      ),
  });
}
