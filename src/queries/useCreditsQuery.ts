import { useQuery } from "@tanstack/react-query";
import { authClient } from "~/server/better-auth/client";

const fetchCredits = async (): Promise<number> => {
  const response = await authClient.usage.meters.list({
    query: {
      page: 1,
      limit: 10,
    },
  });

  const meters = response.data?.result.items[0]?.balance || 0;
  //   const creditsMeter = meters.find(
  //     (m: any) => m.name === "credits"
  //   );

  return meters;
};

export const useCreditsQuery = () => {
  return useQuery({
    queryKey: ["credits"],
    queryFn: fetchCredits,
    staleTime: 1000 * 20, // 20 seconds,
    refetchInterval:1000 * 20,
    retry: 1,
    refetchOnWindowFocus: true,
  });
};
