import { useQuery } from "react-query";
import API from "../api";
import { SummaryActivity } from "../types";

type Props = {
  page: number;
};

export const ACTIVITIES_PER_PAGE = 5;

export const useActivities = ({ page }: Props) => {
  return useQuery(
    ["ACTIVITIES", page],
    () =>
      API.get<SummaryActivity[]>(`athlete/activities`, {
        params: {
          page,
          per_page: ACTIVITIES_PER_PAGE,
        },
      }),
    {
      select: (response) => response.data,
    }
  );
};
