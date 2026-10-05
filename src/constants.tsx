import { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Period, SportType } from "./types";

export type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const ITEMS_PER_PAGE = 30;
export const RECENT_WEEKS = 12;
export const ACCESS_TOKEN_KEY = "Statsva_Access_Token";
export const REFRESH_TOKEN_KEY = "Statsva_Refresh_Token";
export const AUTHORIZATION_ENDPOINT_STRAVA =
  "https://www.strava.com/oauth/mobile/authorize";
export const TOKEN_ENDPOINT_STRAVA = "https://www.strava.com/oauth/token";
export const REVOCATION_ENDPOINT_STRAVA =
  "https://www.strava.com/oauth/deauthorize";
export const STRAVA_CLIENT_ID = "116925";
export const STRAVA_SCOPES = ["activity:read_all"];
export const STRAVA_REDIRECT =
  "com.yabcompany.statsva://com.yabcompany.statsva";
export const STRAVA_API_ENDPOINT = "https://www.strava.com/api/v3";
export const BUY_ME_A_COFFEE_URL = "https://www.buymeacoffee.com/belmirofss";
export const SOURCE_CODE_URL = "https://github.com/belmirofss/statsva";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.yabcompany.statsva";
export const AD_BANNER_HOME_UNIT_ID = "ca-app-pub-6575307967199593/9508618185";
export const AD_BANNER_ACTIVITIES_UNIT_ID =
  "ca-app-pub-6575307967199593/6087150444";
export const AD_BANNER_ACTIVITY_UNIT_ID =
  "ca-app-pub-6575307967199593/4774068777";

export const PERIOD_TO_LABEL: { [key in Period]: string } = {
  [Period.ALL_TIME]: "All time",
  [Period.YEAR_TO_DATE]: "This year",
  [Period.LAST_4_WEEKS]: "Last 4 weeks",
};

export const PERIOD_TO_SHORT_LABEL: { [key in Period]: string } = {
  [Period.LAST_4_WEEKS]: "4 weeks",
  [Period.YEAR_TO_DATE]: "This year",
  [Period.ALL_TIME]: "All time",
};

export const SPORT_TYPE_TO_LABEL: { [key in SportType]: string } = {
  [SportType.RIDE]: "Ride",
  [SportType.RUN]: "Run",
  [SportType.SWIM]: "Swim",
  [SportType.ALPINE_SKI]: "Alpine Ski",
  [SportType.BACKCOUNTRY_SKI]: "Backcountry Ski",
  [SportType.BADMINTON]: "Badminton",
  [SportType.CANOEING]: "Canoeing",
  [SportType.CROSSFIT]: "Crossfit",
  [SportType.ELLIPTICAL]: "Elliptical",
  [SportType.E_BIKE_RIDE]: "E-Bike Ride",
  [SportType.E_MOUNTAIN_BIKE_RIDE]: "E-Bike Mountain Ride",
  [SportType.GOLF]: "Golf",
  [SportType.GRAVEL_RIDE]: "Gravel Ride",
  [SportType.HANDCYCLE]: "Handcycle",
  [SportType.HIGH_INTENSITY_INTERVAL_TRAINING]: "HIIT",
  [SportType.HIKE]: "Hike",
  [SportType.ICE_SKATE]: "Ice Skate",
  [SportType.INLINE_SKATE]: "Inline Skate",
  [SportType.KAYAKING]: "Kayaking",
  [SportType.KITESURF]: "Kitesurf",
  [SportType.MOUNTAIN_BIKE_RIDE]: "Mountain Bike Ride",
  [SportType.NORDIC_SKI]: "Nordic Ski",
  [SportType.PICKLEBALL]: "Pickleball",
  [SportType.PILATES]: "Pilates",
  [SportType.RACQUETBALL]: "Racquetball",
  [SportType.ROCK_CLIMBING]: "Rock Climbing",
  [SportType.ROLLER_SKI]: "Roller Ski",
  [SportType.ROWING]: "Rowing",
  [SportType.SAIL]: "Sail",
  [SportType.SKATEBOARD]: "Skateboard",
  [SportType.SNOWBOARD]: "Snowboard",
  [SportType.SNOWSHOE]: "Snowshoe",
  [SportType.SOCCER]: "Soccer",
  [SportType.SQUASH]: "Squash",
  [SportType.STAIR_STEPPER]: "Stair Stepper",
  [SportType.STAND_UP_PADDLING]: "Stand Up Paddling",
  [SportType.SURFING]: "Surfing",
  [SportType.TABLE_TENNIS]: "Table Tennis",
  [SportType.TENNIS]: "Tennis",
  [SportType.TRAIL_RUN]: "Trail Run",
  [SportType.VELOMOBILE]: "Velomobile",
  [SportType.VIRTUAL_RIDE]: "Virtual Ride",
  [SportType.VIRTUAL_ROW]: "Virtual Row",
  [SportType.VIRTUAL_RUN]: "Virtual Run",
  [SportType.WALK]: "Walk",
  [SportType.WEIGHT_TRAINING]: "Weight Training",
  [SportType.WHEELCHAIR]: "Wheelchair",
  [SportType.WINDSURF]: "Windsurf",
  [SportType.WORKOUT]: "Workout",
  [SportType.YOGA]: "Yoga",
};

export const SPORT_TYPE_TO_ICON: { [key in SportType]: IconName } = {
  [SportType.RIDE]: "bike",
  [SportType.RUN]: "run",
  [SportType.SWIM]: "swim",
  [SportType.ALPINE_SKI]: "ski",
  [SportType.BACKCOUNTRY_SKI]: "ski",
  [SportType.BADMINTON]: "badminton",
  [SportType.CANOEING]: "kayaking",
  [SportType.CROSSFIT]: "dumbbell",
  [SportType.ELLIPTICAL]: "run",
  [SportType.E_BIKE_RIDE]: "bike",
  [SportType.E_MOUNTAIN_BIKE_RIDE]: "bike",
  [SportType.GOLF]: "golf",
  [SportType.GRAVEL_RIDE]: "bike",
  [SportType.HANDCYCLE]: "wheelchair-accessibility",
  [SportType.HIGH_INTENSITY_INTERVAL_TRAINING]: "lightning-bolt",
  [SportType.HIKE]: "hiking",
  [SportType.ICE_SKATE]: "skate",
  [SportType.INLINE_SKATE]: "rollerblade",
  [SportType.KAYAKING]: "kayaking",
  [SportType.KITESURF]: "kitesurfing",
  [SportType.MOUNTAIN_BIKE_RIDE]: "bike",
  [SportType.NORDIC_SKI]: "ski-cross-country",
  [SportType.PICKLEBALL]: "racquetball",
  [SportType.PILATES]: "yoga",
  [SportType.RACQUETBALL]: "racquetball",
  [SportType.ROCK_CLIMBING]: "carabiner",
  [SportType.ROLLER_SKI]: "ski-cross-country",
  [SportType.ROWING]: "rowing",
  [SportType.SAIL]: "sail-boat",
  [SportType.SKATEBOARD]: "skateboard",
  [SportType.SNOWBOARD]: "snowboard",
  [SportType.SNOWSHOE]: "shoe-print",
  [SportType.SOCCER]: "soccer",
  [SportType.SQUASH]: "racquetball",
  [SportType.STAIR_STEPPER]: "stairs",
  [SportType.STAND_UP_PADDLING]: "rowing",
  [SportType.SURFING]: "surfing",
  [SportType.TABLE_TENNIS]: "table-tennis",
  [SportType.TENNIS]: "tennis",
  [SportType.TRAIL_RUN]: "run",
  [SportType.VELOMOBILE]: "bike",
  [SportType.VIRTUAL_RIDE]: "bike",
  [SportType.VIRTUAL_ROW]: "rowing",
  [SportType.VIRTUAL_RUN]: "run",
  [SportType.WALK]: "walk",
  [SportType.WEIGHT_TRAINING]: "weight-lifter",
  [SportType.WHEELCHAIR]: "wheelchair-accessibility",
  [SportType.WINDSURF]: "sail-boat",
  [SportType.WORKOUT]: "arm-flex",
  [SportType.YOGA]: "yoga",
};

export const RIDE_SPORT_TYPES = [
  SportType.RIDE,
  SportType.GRAVEL_RIDE,
  SportType.MOUNTAIN_BIKE_RIDE,
  SportType.E_BIKE_RIDE,
  SportType.E_MOUNTAIN_BIKE_RIDE,
  SportType.VIRTUAL_RIDE,
  SportType.VELOMOBILE,
  SportType.HANDCYCLE,
];

export const RUN_SPORT_TYPES = [
  SportType.RUN,
  SportType.TRAIL_RUN,
  SportType.VIRTUAL_RUN,
];
