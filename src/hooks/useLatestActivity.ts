import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { SummaryActivity } from "../types";

type Props = {
  enabled: boolean;
};

/** Fallback for athletes with nothing in the recent window. */
export const useLatestActivity = ({ enabled }: Props) => {
  return useQuery({
    queryKey: ["LATEST_ACTIVITY"],
    queryFn: () =>
      API.get<SummaryActivity[]>(`athlete/activities`, {
        params: { page: 1, per_page: 1 },
      }),
    select: (response) => response.data[0],
    enabled,
  });
};
