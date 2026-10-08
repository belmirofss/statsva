import { Moment } from "moment";
import { SummaryActivity } from "../types";
import { dayIndex, dayKey, today } from "./dates";

export type ComparePeriod = "year" | "month" | "week";

export type PeriodTotals = {
  distance: number;
  movingTime: number;
  elevation: number;
  count: number;
};

export type Comparison = {
  thisStart: Moment;
  lastStart: Moment;
  /** Index of today within the period, 0-based. */
  elapsed: number;
  thisLength: number;
  lastLength: number;
  /** Cumulative metres per day, up to and including today. */
  thisCumulative: number[];
  /** Cumulative metres per day for the whole previous period. */
  lastCumulative: number[];
  thisTotals: PeriodTotals;
  /** Previous period up to the same point. */
  lastToDate: PeriodTotals;
  lastFull: PeriodTotals;
};

const UNIT = {
  year: "year",
  month: "month",
  week: "isoWeek",
} as const;

const emptyTotals = (): PeriodTotals => ({
  distance: 0,
  movingTime: 0,
  elevation: 0,
  count: 0,
});

const addTo = (totals: PeriodTotals, activity: SummaryActivity) => {
  totals.distance += activity.distance;
  totals.movingTime += activity.moving_time;
  totals.elevation += activity.total_elevation_gain;
  totals.count += 1;
};

const cumulative = (daily: number[]) => {
  let sum = 0;
  return daily.map((value) => (sum += value));
};

export function comparePeriods(
  activities: SummaryActivity[],
  period: ComparePeriod
): Comparison {
  const now = today();
  const unit = UNIT[period];
  const step = period === "week" ? "week" : period;
  const thisStart = now.clone().startOf(unit);
  const lastStart = thisStart.clone().subtract(1, step);
  const thisLength = thisStart.clone().add(1, step).diff(thisStart, "days");
  const lastLength = thisStart.diff(lastStart, "days");
  const elapsed = now.diff(thisStart, "days");
  const sameIndex = Math.min(elapsed, lastLength - 1);

  const thisDaily = Array<number>(elapsed + 1).fill(0);
  const lastDaily = Array<number>(lastLength).fill(0);
  const thisTotals = emptyTotals();
  const lastToDate = emptyTotals();
  const lastFull = emptyTotals();

  activities.forEach((activity) => {
    const key = dayKey(activity);
    const thisIndex = dayIndex(key, thisStart);
    if (thisIndex >= 0 && thisIndex <= elapsed) {
      thisDaily[thisIndex] += activity.distance;
      addTo(thisTotals, activity);
      return;
    }

    const lastIndex = dayIndex(key, lastStart);
    if (lastIndex >= 0 && lastIndex < lastLength) {
      lastDaily[lastIndex] += activity.distance;
      addTo(lastFull, activity);
      if (lastIndex <= sameIndex) {
        addTo(lastToDate, activity);
      }
    }
  });

  return {
    thisStart,
    lastStart,
    elapsed,
    thisLength,
    lastLength,
    thisCumulative: cumulative(thisDaily),
    lastCumulative: cumulative(lastDaily),
    thisTotals,
    lastToDate,
    lastFull,
  };
}

/** Whole-percent change, or undefined when there is nothing to compare to. */
export const percentChange = (current: number, previous: number) =>
  previous ? Math.round(((current - previous) / previous) * 100) : undefined;
