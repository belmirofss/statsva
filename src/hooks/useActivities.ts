import { useInfiniteQuery } from "@tanstack/react-query";
import API from "../api";
import { SummaryActivity } from "../types";
import { ITEMS_PER_PAGE } from "../constants";

export const useActivities = () => {
  return useInfiniteQuery({
    queryKey: ["ACTIVITIES"],
    queryFn: ({ pageParam }) =>
      API.get<SummaryActivity[]>(`athlete/activities`, {
        params: {
          page: pageParam,
          per_page: ITEMS_PER_PAGE,
        },
      }).then((response) => response.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length < ITEMS_PER_PAGE ? undefined : pages.length + 1,
  });
};
