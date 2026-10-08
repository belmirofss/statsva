import { AthleteStats } from "../types";

export type Milestone = {
  label: string;
  /** Kilometres. */
  distance: number;
};

/** Ordered by distance. Straight-line where a route is named "→". */
export const MILESTONES: Milestone[] = [
  { label: "A marathon", distance: 42.195 },
  { label: "London → Paris", distance: 344 },
  { label: "The Camino de Santiago", distance: 780 },
  { label: "Land's End → John o' Groats", distance: 1407 },
  { label: "Route 66", distance: 3940 },
  { label: "The length of the Nile", distance: 6650 },
  { label: "The Trans-Siberian Railway", distance: 9289 },
  { label: "The Great Wall of China", distance: 21196 },
  { label: "Around the Earth", distance: 40075 },
  { label: "To the Moon", distance: 384400 },
];

export const EARTH_KM = 40075;
export const MOON_KM = 384400;
export const EVEREST_M = 8849;
export const EIFFEL_M = 330;
export const MARATHON_KM = 42.195;

export const passedMilestone = (km: number) =>
  [...MILESTONES].reverse().find(({ distance }) => km >= distance);

export const nextMilestone = (km: number) =>
  MILESTONES.find(({ distance }) => km < distance);

/** Ride, run and swim totals added up: the only sports Strava's stats cover. */
export const lifetimeTotals = (stats: AthleteStats) =>
  [stats.all_ride_totals, stats.all_run_totals, stats.all_swim_totals].reduce(
    (sum, totals) => ({
      count: sum.count + totals.count,
      distance: sum.distance + totals.distance,
      movingTime: sum.movingTime + totals.moving_time,
      elevation: sum.elevation + totals.elevation_gain,
    }),
    { count: 0, distance: 0, movingTime: 0, elevation: 0 }
  );

/** Year-to-date distance across ride, run and swim, in metres. */
export const yearToDateDistance = (stats: AthleteStats) =>
  stats.ytd_ride_totals.distance +
  stats.ytd_run_totals.distance +
  stats.ytd_swim_totals.distance;
