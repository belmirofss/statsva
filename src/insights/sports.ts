import { RIDE_SPORT_TYPES, RUN_SPORT_TYPES } from "../constants";
import { SportType, SummaryActivity } from "../types";

export type SportFilter = "all" | "run" | "ride" | "swim";

export const SPORT_FILTER_OPTIONS: { value: SportFilter; label: string }[] = [
  { value: "run", label: "Run" },
  { value: "ride", label: "Ride" },
  { value: "swim", label: "Swim" },
  { value: "all", label: "All" },
];

export const SPORT_FILTER_UNIT: { [key in SportFilter]: string } = {
  all: "activities",
  run: "runs",
  ride: "rides",
  swim: "swims",
};

export const isRun = (sportType: SportType) => RUN_SPORT_TYPES.includes(sportType);

export const matchesSport = (filter: SportFilter, activity: SummaryActivity) => {
  switch (filter) {
    case "run":
      return isRun(activity.sport_type);
    case "ride":
      return RIDE_SPORT_TYPES.includes(activity.sport_type);
    case "swim":
      return activity.sport_type === SportType.SWIM;
    default:
      return true;
  }
};

/** The sport this athlete logs most distance in, for sensible defaults. */
export const mainSport = (activities: SummaryActivity[]): SportFilter => {
  const totals = { run: 0, ride: 0, swim: 0 };
  activities.forEach((activity) => {
    (["run", "ride", "swim"] as const).forEach((sport) => {
      if (matchesSport(sport, activity)) {
        totals[sport] += activity.moving_time;
      }
    });
  });

  const [best, seconds] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  return seconds ? (best as SportFilter) : "all";
};
