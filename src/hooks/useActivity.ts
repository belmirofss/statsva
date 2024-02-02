import { useQuery } from "react-query";
import API from "../api";
import { Activity } from "../types";

type Props = {
  id: number;
};

export const useActivity = ({ id }: Props) => {
  return useQuery(
    ["ACTIVITY", id],
    () => API.get<Activity>(`activities/${id}`),
    {
      select: (response) => response.data,
    }
  );
}; 
