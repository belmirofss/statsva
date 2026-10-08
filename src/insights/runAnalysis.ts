import { Activity, ActivityStreams } from "../types";

export type SplitType = "negative" | "even" | "positive";

export type Pacing = {
  /** Seconds per km. */
  firstHalf: number;
  secondHalf: number;
  type: SplitType;
  /** 100 is perfectly even. */
  consistency: number;
  fastestSplit: number;
  isLastFastest: boolean;
};

export type Decoupling = {
  percent: number;
  first: { pace: number; heartrate: number };
  second: { pace: number; heartrate: number };
};

export type Prediction = {
  label: string;
  distance: number;
  seconds: number;
};

export type RacePrediction = {
  sourceName: string;
  sourceDistance: number;
  sourceSeconds: number;
  predictions: Prediction[];
};

/** Splits shorter than this (the leftover at the end) are left out. */
const FULL_SPLIT = 950;
const EVEN_THRESHOLD = 0.01;
const RIEGEL_EXPONENT = 1.06;
const MIN_SPEED = 0.5;

const RACES = [
  { label: "5K", distance: 5000 },
  { label: "10K", distance: 10000 },
  { label: "Half", distance: 21097.5 },
  { label: "Marathon", distance: 42195 },
];

/** Standard best efforts long enough to predict from, longest first. */
const SOURCE_EFFORTS = [
  "Marathon",
  "30k",
  "Half-Marathon",
  "20k",
  "10 mile",
  "15k",
  "10k",
  "5k",
];

const mean = (values: number[]) =>
  values.reduce((sum, v) => sum + v, 0) / values.length;

export function pacing(activity: Activity): Pacing | undefined {
  const splits = (activity.splits_metric ?? []).filter(
    (split) => split.distance >= FULL_SPLIT && split.average_speed > 0
  );
  if (splits.length < 4) {
    return undefined;
  }

  const half = Math.floor(splits.length / 2);
  const paceOf = (list: typeof splits) =>
    list.reduce((sum, s) => sum + s.moving_time, 0) /
    (list.reduce((sum, s) => sum + s.distance, 0) / 1000);

  const firstHalf = paceOf(splits.slice(0, half));
  const secondHalf = paceOf(splits.slice(splits.length - half));
  const change = (secondHalf - firstHalf) / firstHalf;

  const speeds = splits.map((split) => split.average_speed);
  const average = mean(speeds);
  const deviation = Math.sqrt(mean(speeds.map((s) => (s - average) ** 2)));
  const variation = deviation / average;

  const paces = splits.map((split) => 1000 / split.average_speed);
  const fastestSplit = Math.min(...paces);

  return {
    firstHalf,
    secondHalf,
    type:
      change < -EVEN_THRESHOLD
        ? "negative"
        : change > EVEN_THRESHOLD
        ? "positive"
        : "even",
    consistency: Math.max(0, Math.min(100, Math.round(100 - variation * 400))),
    fastestSplit,
    isLastFastest: paces[paces.length - 1] === fastestSplit,
  };
}

/**
 * Aerobic decoupling: how much the pace-to-heart-rate ratio drops from the
 * first half to the second. Under 5% points to a solid aerobic base.
 */
export function decoupling(streams: ActivityStreams): Decoupling | undefined {
  const speed = streams.velocity_smooth?.data;
  const heartrate = streams.heartrate?.data;
  if (!speed || !heartrate || speed.length !== heartrate.length || speed.length < 60) {
    return undefined;
  }

  const half = (from: number, to: number) => {
    const speeds: number[] = [];
    const rates: number[] = [];
    for (let i = from; i < to; i++) {
      if (speed[i] > MIN_SPEED && heartrate[i] > 0) {
        speeds.push(speed[i]);
        rates.push(heartrate[i]);
      }
    }
    return speeds.length
      ? { speed: mean(speeds), heartrate: mean(rates) }
      : undefined;
  };

  const middle = Math.floor(speed.length / 2);
  const first = half(0, middle);
  const second = half(middle, speed.length);
  if (!first || !second) {
    return undefined;
  }

  const ratio1 = first.speed / first.heartrate;
  const ratio2 = second.speed / second.heartrate;

  return {
    percent: ((ratio1 - ratio2) / ratio1) * 100,
    first: { pace: 1000 / first.speed, heartrate: first.heartrate },
    second: { pace: 1000 / second.speed, heartrate: second.heartrate },
  };
}

/**
 * Riegel's formula, T2 = T1 × (D2 / D1)^1.06, from the longest standard best
 * effort in this run, or the run itself when it has none.
 */
export function predictRaces(activity: Activity): RacePrediction | undefined {
  const efforts = activity.best_efforts ?? [];
  const effort = SOURCE_EFFORTS.map((name) =>
    efforts.find((e) => e.name.toLowerCase() === name.toLowerCase())
  ).find(Boolean);

  const source = effort
    ? { name: `${effort.name} best effort`, distance: effort.distance, seconds: effort.elapsed_time }
    : activity.distance >= 3000 && activity.moving_time
    ? { name: "this run", distance: activity.distance, seconds: activity.moving_time }
    : undefined;

  if (!source) {
    return undefined;
  }

  return {
    sourceName: source.name,
    sourceDistance: source.distance,
    sourceSeconds: source.seconds,
    predictions: RACES.map(({ label, distance }) => ({
      label,
      distance,
      seconds: source.seconds * (distance / source.distance) ** RIEGEL_EXPONENT,
    })),
  };
}
