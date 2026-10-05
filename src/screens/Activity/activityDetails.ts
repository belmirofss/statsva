import { Activity, TitleAndContent } from "../../types";
import {
  activityLocalMoment,
  formatCalories,
  formatDistance,
  formatElevation,
  formatHeartrate,
  formatNumber,
  formatSpeedForSport,
  formatTime,
  formatWatts,
  speedLabelForSport,
  usesPace,
} from "../../helpers";
import { SPORT_TYPE_TO_LABEL } from "../../constants";
import { ShareCardContent } from "../../components/share/ShareCard";

const positive = (value: number | null | undefined) =>
  value ? formatNumber(value) : undefined;

export function mainStats(activity: Activity): TitleAndContent[] {
  return [
    { title: "Distance", content: formatDistance(activity.distance) },
    { title: "Moving time", content: formatTime(activity.moving_time) },
    {
      title: speedLabelForSport(activity.sport_type),
      content: formatSpeedForSport(activity.sport_type, activity.average_speed),
    },
    {
      title: "Elevation gain",
      content: formatElevation(activity.total_elevation_gain),
    },
  ];
}

/** Every other field Strava returns for the activity. */
export function detailStats(activity: Activity): TitleAndContent[] {
  const pace = usesPace(activity.sport_type);
  const hasElevationRange =
    typeof activity.elev_low === "number" &&
    typeof activity.elev_high === "number";
  const cadence = activity.average_cadence
    ? pace
      ? `${Math.round(activity.average_cadence * 2)} spm`
      : `${Math.round(activity.average_cadence)} rpm`
    : undefined;

  return [
    { title: "Elapsed time", content: formatTime(activity.elapsed_time) },
    {
      title: pace ? "Best pace" : "Max speed",
      content: formatSpeedForSport(activity.sport_type, activity.max_speed),
    },
    {
      title: "Elevation range",
      content: hasElevationRange
        ? `${formatNumber(activity.elev_low)} – ${formatNumber(
            activity.elev_high
          )} m`
        : undefined,
    },
    { title: "Avg heart rate", content: formatHeartrate(activity.average_heartrate) },
    { title: "Max heart rate", content: formatHeartrate(activity.max_heartrate) },
    { title: "Avg power", content: formatWatts(activity.average_watts) },
    {
      title: "Weighted avg power",
      content: formatWatts(activity.weighted_average_watts),
    },
    { title: "Max power", content: formatWatts(activity.max_watts) },
    {
      title: "Energy",
      content: activity.kilojoules
        ? `${formatNumber(activity.kilojoules)} kJ`
        : undefined,
    },
    { title: "Calories", content: formatCalories(activity.calories) },
    { title: "Avg cadence", content: cadence },
    {
      title: "Avg temperature",
      content:
        typeof activity.average_temp === "number"
          ? `${activity.average_temp} °C`
          : undefined,
    },
    { title: "Relative effort", content: positive(activity.suffer_score) },
    { title: "Achievements", content: positive(activity.achievement_count) },
    { title: "Personal records", content: positive(activity.pr_count) },
    { title: "Kudos", content: positive(activity.kudos_count) },
    { title: "Comments", content: positive(activity.comment_count) },
    { title: "Photos", content: positive(activity.total_photo_count) },
    { title: "Gear", content: activity.gear?.name || undefined },
    { title: "Device", content: activity.device_name || undefined },
  ];
}

export function shareContent(activity: Activity): ShareCardContent {
  return {
    eyebrow: SPORT_TYPE_TO_LABEL[activity.sport_type] ?? activity.sport_type,
    eyebrowRight: activityLocalMoment(activity.start_date_local).format(
      "MMM D, YYYY"
    ),
    title: activity.name,
    polyline: activity.map?.summary_polyline || activity.map?.polyline,
    stats: [
      ...mainStats(activity),
      { title: "Avg heart rate", content: formatHeartrate(activity.average_heartrate) },
      { title: "Calories", content: formatCalories(activity.calories) },
      { title: "Avg power", content: formatWatts(activity.average_watts) },
    ]
      .filter(({ content }) => content !== undefined)
      .slice(0, 6),
  };
}
