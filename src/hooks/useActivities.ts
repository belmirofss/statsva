import { useQuery } from "react-query";
import API from "../api";
import { SummaryActivity } from "../types";

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
          per_page: 30,
        },
      }),
    {
      select: (response) => response.data,
    }
  );
};
