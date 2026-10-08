import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatHeartrate,
  formatSpeedForSport,
  usesPace,
} from "./helpers";
import { SummaryActivity } from "./types";

export type SummaryStat = { label: string; value: string };

/** Up to three short labelled values for compact rows and cards. */
export function summaryStats(activity: SummaryActivity): SummaryStat[] {
  const pace = usesPace(activity.sport_type);
  const speed = {
    label: pace ? "Pace" : "Avg speed",
    value: formatSpeedForSport(activity.sport_type, activity.average_speed),
  };
  const elevation = {
    label: "Elevation",
    value: formatElevation(activity.total_elevation_gain),
  };
  const third = pace || !elevation.value ? speed : elevation;

  return [
    { label: "Distance", value: formatDistance(activity.distance) },
    { label: "Time", value: formatDuration(activity.moving_time) },
    third.value
      ? third
      : { label: "Avg HR", value: formatHeartrate(activity.average_heartrate) },
  ].filter((stat): stat is SummaryStat => !!stat.value);
}
