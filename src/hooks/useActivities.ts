import { useQuery } from "react-query";
import API from "../api";
import { SummaryActivity } from "../types";
import { ITEMS_PER_PAGE } from "../constants";

type Props = {
  page: number;
};

export const useActivities = ({ page }: Props) => {
  return useQuery(
    ["ACTIVITIES", page],
    () =>
      API.get<SummaryActivity[]>(`athlete/activities`, {
        params: {
          page,
          per_page: ITEMS_PER_PAGE,
        },
      }),
    {
      select: (response) => response.data,
    }
  );
};
