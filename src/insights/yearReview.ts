import moment from "moment";
import { RIDE_SPORT_TYPES } from "../constants";
import { SportType, SummaryActivity } from "../types";
import { dayKey, localStartHour } from "./dates";
import { isRun } from "./sports";

export type SportShare = {
  label: string;
  plural: string;
  seconds: number;
  count: number;
};

export type YearReview = {
  year: number;
  count: number;
  distance: number;
  movingTime: number;
  elevation: number;
  activeDays: number;
  sports: SportShare[];
  biggest?: SummaryActivity;
  /** Metres per month, January first. */
  months: number[];
  busiestMonth: number;
  favouriteWeekday?: string;
  earliest?: SummaryActivity;
};

const sportGroup = (sportType: SportType): [string, string] => {
  if (isRun(sportType)) return ["Run", "runs"];
  if (RIDE_SPORT_TYPES.includes(sportType)) return ["Ride", "rides"];
  if (sportType === SportType.SWIM) return ["Swim", "swims"];
  if (sportType === SportType.WALK || sportType === SportType.HIKE) {
    return ["Walk & hike", "walks and hikes"];
  }
  if (
    sportType === SportType.WEIGHT_TRAINING ||
    sportType === SportType.WORKOUT ||
    sportType === SportType.CROSSFIT ||
    sportType === SportType.HIGH_INTENSITY_INTERVAL_TRAINING
  ) {
    return ["Workout", "workouts"];
  }
  return ["Other", "other activities"];
};

/**
 * The year to celebrate: last year until December, when the current one is
 * nearly complete.
 */
export const reviewYear = () => {
  const now = moment();
  return now.month() === 11 ? now.year() : now.year() - 1;
};

export function yearReview(
  activities: SummaryActivity[],
  year: number
): YearReview | undefined {
  const inYear = activities.filter(
    (activity) => Number(activity.start_date_local.slice(0, 4)) === year
  );
  if (!inYear.length) {
    return undefined;
  }

  const months = Array<number>(12).fill(0);
  const weekdays = Array<number>(7).fill(0);
  const days = new Set<string>();
  const sports = new Map<string, SportShare>();

  inYear.forEach((activity) => {
    const local = moment.utc(activity.start_date_local);
    months[local.month()] += activity.distance;
    weekdays[local.isoWeekday() - 1]++;
    days.add(dayKey(activity));

    const [label, plural] = sportGroup(activity.sport_type);
    const share = sports.get(label) ?? { label, plural, seconds: 0, count: 0 };
    share.seconds += activity.moving_time;
    share.count++;
    sports.set(label, share);
  });

  // Past-midnight sessions are late, not early.
  const recorded = inYear.filter(
    (activity) => !activity.manual && localStartHour(activity) >= 3
  );
  const busiestWeekday = weekdays.indexOf(Math.max(...weekdays));

  return {
    year,
    count: inYear.length,
    distance: inYear.reduce((sum, a) => sum + a.distance, 0),
    movingTime: inYear.reduce((sum, a) => sum + a.moving_time, 0),
    elevation: inYear.reduce((sum, a) => sum + a.total_elevation_gain, 0),
    activeDays: days.size,
    sports: [...sports.values()].sort((a, b) => b.seconds - a.seconds),
    biggest: inYear.reduce<SummaryActivity | undefined>(
      (best, a) => (a.distance > (best?.distance ?? 0) ? a : best),
      undefined
    ),
    months,
    busiestMonth: months.indexOf(Math.max(...months)),
    favouriteWeekday: moment().isoWeekday(busiestWeekday + 1).format("dddd"),
    earliest: recorded.reduce<SummaryActivity | undefined>(
      (best, a) =>
        !best || localStartHour(a) < localStartHour(best) ? a : best,
      undefined
    ),
  };
}
