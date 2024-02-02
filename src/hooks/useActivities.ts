import { useQuery } from "react-query";
import API from "../api";
import { SummaryActivity } from "../types";
import { ITEMS_PER_PAGE } from "../constants";

type Props = {
  page: number;
  perPage?: number;
};

export const useActivities = ({ page, perPage = ITEMS_PER_PAGE }: Props) => {
  return useQuery(
    ["ACTIVITIES", page, perPage],
    () =>
      API.get<SummaryActivity[]>(`athlete/activities`, {
        params: {
          page,
          per_page: perPage,
        },
      }),
    {
      select: (response) => response.data,
    }
  );
};
