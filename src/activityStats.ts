import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatHeartrate,
  formatSpeedForSport,
  usesPace,
} from "./helpers";
import { SummaryActivity } from "./types";

/** Up to three short values for compact rows and cards. */
export function summaryStats(activity: SummaryActivity): string[] {
  const third = usesPace(activity.sport_type)
    ? formatSpeedForSport(activity.sport_type, activity.average_speed)
    : formatElevation(activity.total_elevation_gain) ??
      formatSpeedForSport(activity.sport_type, activity.average_speed);

  return [
    formatDistance(activity.distance),
    formatDuration(activity.moving_time),
    third ?? formatHeartrate(activity.average_heartrate),
  ].filter((value): value is string => !!value);
}
