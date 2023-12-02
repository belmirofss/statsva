import { useQuery } from "react-query";
import API from "../api";
import { AthleteStats } from "../types";
import { useAppContext } from "./useAppContext";

export const useAthleteStats = () => {
  const { me } = useAppContext();

  return useQuery(
    ["ATHLETE_STATS"],
    () => API.get<AthleteStats>(`athletes/${me?.id}/stats`),
    {
      select: (response) => response.data,
    }
  );
};
