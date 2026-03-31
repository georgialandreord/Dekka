import { useQuery } from "@tanstack/react-query";
import { authClient } from "~/server/better-auth/client";

export const getSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    staleTime: 5 * 1000,
    queryFn: async () => {
      const { data } = await authClient.customer.state();

      return data;
    },
  });
};

export const useActiveSubscription = () => {
  const { data, isLoading, ...rest } = getSubscription();

  const isActiveSubscription =
    data?.activeSubscriptions && data?.activeSubscriptions.length > 0;

  return {
    data,
    isActiveSubscription,
    isLoading,
    subscription: data?.activeSubscriptions?.[0],
    ...rest,
  };
};