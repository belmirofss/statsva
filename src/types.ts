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

export enum SportType {
  ALPINE_SKI = "AlpineSki",
  BACKCOUNTRY_SKI = "BackcountrySki",
  BADMINTON = "Badminton",
  CANOEING = "Canoeing",
  CROSSFIT = "Crossfit",
  E_BIKE_RIDE = "EBikeRide",
  ELLIPTICAL = "Elliptical",
  E_MOUNTAIN_BIKE_RIDE = "EMountainBikeRide",
  GOLF = "Golf",
  GRAVEL_RIDE = "GravelRide",
  HANDCYCLE = "Handcycle",
  HIGH_INTENSITY_INTERVAL_TRAINING = "HighIntensityIntervalTraining",
  HIKE = "Hike",
  ICE_SKATE = "IceSkate",
  INLINE_SKATE = "InlineSkate",
  KAYAKING = "Kayaking",
  KITESURF = "Kitesurf",
  MOUNTAIN_BIKE_RIDE = "MountainBikeRide",
  NORDIC_SKI = "NordicSki",
  PICKLEBALL = "Pickleball",
  PILATES = "Pilates",
  RACQUETBALL = "Racquetball",
  RIDE = "Ride",
  ROCK_CLIMBING = "RockClimbing",
  ROLLER_SKI = "RollerSki",
  ROWING = "Rowing",
  RUN = "Run",
  SAIL = "Sail",
  SKATEBOARD = "Skateboard",
  SNOWBOARD = "Snowboard",
  SNOWSHOE = "Snowshoe",
  SOCCER = "Soccer",
  SQUASH = "Squash",
  STAIR_STEPPER = "StairStepper",
  STAND_UP_PADDLING = "StandUpPaddling",
  SURFING = "Surfing",
  SWIM = "Swim",
  TABLE_TENNIS = "TableTennis",
  TENNIS = "Tennis",
  TRAIL_RUN = "TrailRun",
  VELOMOBILE = "Velomobile",
  VIRTUAL_RIDE = "VirtualRide",
  VIRTUAL_ROW = "VirtualRow",
  VIRTUAL_RUN = "VirtualRun",
  WALK = "Walk",
  WEIGHT_TRAINING = "WeightTraining",
  WHEELCHAIR = "Wheelchair",
  WINDSURF = "Windsurf",
  WORKOUT = "Workout",
  YOGA = "Yoga",
}

type ActivityMap = {
  id: string;
  summary_polyline: string;
};

export type SummaryActivity = {
  id: number;
  achievement_count: number;
  average_heartrate: number;
  average_speed: number;
  average_watts: number;
  distance: number;
  elapsed_time: number;
  elev_high: number;
  elev_low: number;
  has_heartrate: boolean;
  kilojoules: number;
  location_city: string | null;
  location_country: string | null;
  location_state: string | null;
  manual: boolean;
  map?: ActivityMap;
  max_heartrate: number | null;
  max_speed: number;
  moving_time: number;
  name: string;
  photo_count: number;
  sport_type: SportType;
  start_date: string;
  start_date_local: string;
  end_latlng: [number, number];
  start_latlng: [number, number];
  timezone: string;
  total_elevation_gain: number;
  total_photo_count: number;
  trainer: boolean;
};

export type Segment = {
  id: number;
  name: string;
  activity_type: SportType;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
  start_latlng: [number, number];
  end_latlng: [number, number];
  city: string | null;
  state: string | null;
  country: string | null;
};

export type SegmentEffort = {
  id: number;
  name: string;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  average_cadence: number;
  average_watts: number;
  segment: Segment;
  kom_rank: number | null;
  pr_rank: number | null;
  achievements: string[];
};

type Photo = {
  unique_id: string;
  urls: { [key: string]: string };
};

export type Activity = SummaryActivity & {
  map: ActivityMap & { polyline: string };
  average_cadence: number;
  average_temp: number;
  max_watts: number;
  description: string;
  calories: number | undefined;
  segment_efforts: SegmentEffort[];
  photos: {
    primary: Photo;
  };
};

export enum Period {
  ALL_TIME = "ALL_TIME",
  YEAR_TO_DATE = "YEAR_TO_DATE",
  LAST_4_WEEKS = "LAST_4_WEEKS"
}

export type TitleAndContent = {
  title: string;
  content: string | number | undefined;
};