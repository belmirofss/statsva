export enum ResourceState {
  META = 1,
  SUMMARY = 2,
  DETAIL = 3,
}

export enum Sex {
  MALE = "M",
  FEMALE = "F",
}

export type SummaryAthlete = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  profile_medium: string;
  profile: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  sex: Sex;
  premium: boolean;
  summit: boolean;
};

type AthleteStatsTotals = {
  count: number;
  distance: number;
  elapsed_time: number;
  elevation_gain: number;
  moving_time: number;
};

type AthleteStatsRideTotals = AthleteStatsTotals & {
  achievement_count?: number;
};

export type AthleteStats = {
  all_ride_totals: AthleteStatsTotals;
  all_run_totals: AthleteStatsTotals;
  all_swim_totals: AthleteStatsTotals;
  biggest_climb_elevation_gain: number;
  biggest_ride_distance: number;
  recent_ride_totals: AthleteStatsRideTotals;
  recent_run_totals: AthleteStatsTotals;
  recent_swim_totals: AthleteStatsTotals;
  ytd_ride_totals: AthleteStatsTotals;
  ytd_run_totals: AthleteStatsTotals;
  ytd_swim_totals: AthleteStatsTotals;
};
