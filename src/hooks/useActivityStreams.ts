import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { ActivityStreams, StreamType } from "../types";

const KEYS: StreamType[] = [
  "distance",
  "altitude",
  "heartrate",
  "velocity_smooth",
  "watts",
];

type Props = {
  id: number;
  enabled: boolean;
};

export const useActivityStreams = ({ id, enabled }: Props) => {
  return useQuery({
    queryKey: ["ACTIVITY_STREAMS", id],
    queryFn: () =>
      API.get<ActivityStreams>(`activities/${id}/streams`, {
        params: { keys: KEYS.join(","), key_by_type: true },
      }),
    select: (response) => response.data,
    enabled,
    staleTime: Infinity,
    retry: false,
  });
};
