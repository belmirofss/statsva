import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import API from "../api";
import { Segment, SegmentEffort } from "../types";

export type AthleteSegmentStats = {
  pr_elapsed_time?: number | null;
  pr_date?: string | null;
  effort_count?: number | null;
};

export type DetailedSegment = Segment & {
  total_elevation_gain?: number;
  athlete_segment_stats?: AthleteSegmentStats | null;
};

export type StarredSegment = Segment & {
  athlete_pr_effort?: { pr_elapsed_time?: number; pr_date?: string } | null;
};

export const useSegment = (id: number) => {
  return useQuery({
    queryKey: ["SEGMENT", id],
    queryFn: () => API.get<DetailedSegment>(`segments/${id}`),
    select: (response) => response.data,
  });
};

/**
 * Every effort the athlete has on a segment, oldest first. Strava only serves
 * this to subscribers; everyone else gets a 402, reported as `isLocked`.
 */
export const useSegmentEfforts = (id: number) => {
  const query = useQuery({
    queryKey: ["SEGMENT_EFFORTS", id],
    queryFn: () =>
      API.get<SegmentEffort[]>(`segment_efforts`, {
        params: { segment_id: id, per_page: 200 },
      }),
    select: (response) =>
      [...response.data].sort((a, b) =>
        a.start_date.localeCompare(b.start_date)
      ),
    retry: false,
  });

  const status = (query.error as AxiosError | null)?.response?.status;

  return { ...query, isLocked: status === 402 || status === 403 };
};

export const useStarredSegments = () => {
  return useQuery({
    queryKey: ["STARRED_SEGMENTS"],
    queryFn: () =>
      API.get<StarredSegment[]>(`segments/starred`, {
        params: { per_page: 30 },
      }),
    select: (response) => response.data,
  });
};
