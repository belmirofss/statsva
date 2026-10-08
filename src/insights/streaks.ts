import { Moment } from "moment";
import { SummaryActivity } from "../types";
import { asDay, DAY_FORMAT, dayKey, today } from "./dates";

export type StreakMode = "weekly" | "daily";

export type Streak = {
  current: number;
  /** First day or week of the current streak. */
  since?: Moment;
  /** True when today (or this week) is not logged yet but the streak is alive. */
  pending: boolean;
  longest: number;
  longestStart?: Moment;
  longestEnd?: Moment;
  /** Oldest to newest; the last entry is today or this week. */
  chain: boolean[];
};

const CHAIN_LENGTH = 16;

const unitStart = (day: Moment, mode: StreakMode) =>
  mode === "weekly" ? day.clone().startOf("isoWeek") : day.clone();

const unitKey = (day: Moment, mode: StreakMode) =>
  unitStart(day, mode).format(DAY_FORMAT);

/**
 * A day counts when it has any activity; a week counts when any of its days
 * does. Today, or the current week, only breaks the streak once it is over.
 */
export function computeStreak(
  activities: SummaryActivity[],
  mode: StreakMode,
  from: Moment
): Streak {
  const step = mode === "weekly" ? "week" : "day";
  const active = new Set(activities.map((a) => unitKey(asDay(dayKey(a)), mode)));
  const now = unitStart(today(), mode);
  const first = unitStart(from, mode);

  let longest = 0;
  let longestStart: Moment | undefined;
  let longestEnd: Moment | undefined;
  let run = 0;
  let runStart: Moment | undefined;

  for (const cursor = first.clone(); !cursor.isAfter(now); cursor.add(1, step)) {
    if (active.has(cursor.format(DAY_FORMAT))) {
      if (!run) runStart = cursor.clone();
      run++;
      if (run > longest) {
        longest = run;
        longestStart = runStart;
        longestEnd = cursor.clone();
      }
    } else {
      run = 0;
    }
  }

  const pending = !active.has(now.format(DAY_FORMAT));
  let current = 0;
  const cursor = pending ? now.clone().subtract(1, step) : now.clone();
  while (active.has(cursor.format(DAY_FORMAT))) {
    current++;
    cursor.subtract(1, step);
  }

  const chain = Array.from({ length: CHAIN_LENGTH }, (_, index) =>
    active.has(
      now
        .clone()
        .subtract(CHAIN_LENGTH - 1 - index, step)
        .format(DAY_FORMAT)
    )
  );

  return {
    current,
    since: current ? cursor.clone().add(1, step) : undefined,
    pending,
    longest,
    longestStart,
    longestEnd,
    chain,
  };
}

/** Moving time per calendar day, keyed YYYY-MM-DD. */
export function secondsByDay(activities: SummaryActivity[]) {
  const seconds = new Map<string, number>();
  activities.forEach((activity) => {
    const key = dayKey(activity);
    seconds.set(key, (seconds.get(key) ?? 0) + activity.moving_time);
  });
  return seconds;
}

/** 0 for rest days, then 1–3 by thirds of the busiest day. */
export const dayLevel = (seconds: number, max: number) =>
  !seconds ? 0 : seconds <= max / 3 ? 1 : seconds <= (max * 2) / 3 ? 2 : 3;
