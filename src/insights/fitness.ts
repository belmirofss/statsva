import { Moment } from "moment";
import { SummaryActivity } from "../types";
import { DAY_FORMAT, dayIndex, dayKey, today } from "./dates";

const FITNESS_DAYS = 42;
const FATIGUE_DAYS = 7;
/** Relative Effort per moving minute, used when an activity has no heart rate. */
const ESTIMATE_PER_MINUTE = 0.7;

export type FormZone = "overreaching" | "productive" | "neutral" | "fresh";

export type FitnessSeries = {
  dates: string[];
  fitness: number[];
  fatigue: number[];
  form: number[];
  estimatedCount: number;
};

export const FORM_ZONES: { zone: FormZone; label: string; below: number }[] = [
  { zone: "overreaching", label: "Overreaching", below: -30 },
  { zone: "productive", label: "Productive", below: -10 },
  { zone: "neutral", label: "Neutral", below: 5 },
  { zone: "fresh", label: "Fresh", below: Infinity },
];

export const formZone = (form: number) =>
  FORM_ZONES.find(({ below }) => form < below) ?? FORM_ZONES[3];

export const FORM_ADVICE: { [key in FormZone]: string } = {
  overreaching:
    "Fatigue is well above your fitness. Take a few easy or rest days before it turns into injury or illness.",
  productive:
    "You are absorbing a solid block of training. Keep easy days easy, and plan a lighter week soon to bank the fitness.",
  neutral:
    "Your load matches what you are used to. Hold steady, or add a little to keep building.",
  fresh:
    "You are well rested. A good moment to race or test yourself, but stay fresh too long and fitness starts to fade.",
};

/** Strava's Relative Effort, or an estimate from moving time without it. */
export const activityLoad = (activity: SummaryActivity) =>
  activity.suffer_score ?? (activity.moving_time / 60) * ESTIMATE_PER_MINUTE;

/**
 * Fitness and fatigue are exponentially weighted averages of daily load over
 * 42 and 7 days (the CTL/ATL model); form is fitness minus fatigue.
 */
export function fitnessSeries(
  activities: SummaryActivity[],
  from: Moment,
  days: number
): FitnessSeries {
  const end = today();
  const total = end.diff(from, "days") + 1;
  const loads = Array<number>(total).fill(0);
  let estimatedCount = 0;

  activities.forEach((activity) => {
    const index = dayIndex(dayKey(activity), from);
    if (index >= 0 && index < total) {
      loads[index] += activityLoad(activity);
      if (activity.suffer_score == null && index >= total - days) {
        estimatedCount++;
      }
    }
  });

  let fitness = 0;
  let fatigue = 0;
  const series: FitnessSeries = {
    dates: [],
    fitness: [],
    fatigue: [],
    form: [],
    estimatedCount,
  };

  loads.forEach((load, index) => {
    fitness += (load - fitness) / FITNESS_DAYS;
    fatigue += (load - fatigue) / FATIGUE_DAYS;

    if (index >= total - days) {
      series.dates.push(from.clone().add(index, "days").format(DAY_FORMAT));
      series.fitness.push(fitness);
      series.fatigue.push(fatigue);
      series.form.push(fitness - fatigue);
    }
  });

  return series;
}
