import { SwimmingImg } from "./components/imgs/SwimmingImg";
import { RunningImg } from "./components/imgs/RunningImg";
import { BikingImg } from "./components/imgs/BikingImg";
import { Period, SportType } from "./types";
import { ReactElement } from "react";
import { OtherImg } from "./components/imgs/OtherImg";

export const ITEMS_PER_PAGE = 5;
export const ACCESS_TOKEN_KEY = "Statsva_Access_Token";
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
export const AD_UNIT_ID = "ca-app-pub-6575307967199593/3150546941";

export const PERIOD_TO_LABEL: { [key in Period]: string } = {
  [Period.ALL_TIME]: "All time",
  [Period.YEAR_TO_DATE]: "This year",
  [Period.LAST_4_WEEKS]: "Last 4 weeks",
};

export const SPORT_TYPE_TO_LABEL: { [key in SportType]: string } = {
  [SportType.RIDE]: "Ride",
  [SportType.RUN]: "Run",
  [SportType.SWIM]: "Swim",
  [SportType.ALPINE_SKI]: "Alpine Ski",
  [SportType.BACKCOUNTRY_SKI]: "Backcountry Ski",
  [SportType.BADMINTON]: "Badminton",
  [SportType.CANOEING]: "Conoeing",
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
  [SportType.KITESURF]: "kitesurf",
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
  [SportType.WALK]: "Run",
  [SportType.WEIGHT_TRAINING]: "Weight Training",
  [SportType.WHEELCHAIR]: "Wheelchair",
  [SportType.WINDSURF]: "Windsurf",
  [SportType.WORKOUT]: "Workout",
  [SportType.YOGA]: "Yoga",
};

export const SPORT_TYPE_TO_ICON: { [key in SportType]: () => ReactElement } = {
  [SportType.RIDE]: () => <BikingImg />,
  [SportType.RUN]: () => <RunningImg />,
  [SportType.SWIM]: () => <SwimmingImg />,
  [SportType.ALPINE_SKI]: () => <OtherImg />,
  [SportType.BACKCOUNTRY_SKI]: () => <OtherImg />,
  [SportType.BADMINTON]: () => <OtherImg />,
  [SportType.CANOEING]: () => <OtherImg />,
  [SportType.CROSSFIT]: () => <OtherImg />,
  [SportType.ELLIPTICAL]: () => <OtherImg />,
  [SportType.E_BIKE_RIDE]: () => <OtherImg />,
  [SportType.E_MOUNTAIN_BIKE_RIDE]: () => <OtherImg />,
  [SportType.GOLF]: () => <OtherImg />,
  [SportType.GRAVEL_RIDE]: () => <OtherImg />,
  [SportType.HANDCYCLE]: () => <OtherImg />,
  [SportType.HIGH_INTENSITY_INTERVAL_TRAINING]: () => <OtherImg />,
  [SportType.HIKE]: () => <OtherImg />,
  [SportType.ICE_SKATE]: () => <OtherImg />,
  [SportType.INLINE_SKATE]: () => <OtherImg />,
  [SportType.KAYAKING]: () => <OtherImg />,
  [SportType.KITESURF]: () => <OtherImg />,
  [SportType.MOUNTAIN_BIKE_RIDE]: () => <OtherImg />,
  [SportType.NORDIC_SKI]: () => <OtherImg />,
  [SportType.PICKLEBALL]: () => <OtherImg />,
  [SportType.PILATES]: () => <OtherImg />,
  [SportType.RACQUETBALL]: () => <OtherImg />,
  [SportType.ROCK_CLIMBING]: () => <OtherImg />,
  [SportType.ROLLER_SKI]: () => <OtherImg />,
  [SportType.ROWING]: () => <OtherImg />,
  [SportType.SAIL]: () => <OtherImg />,
  [SportType.SKATEBOARD]: () => <OtherImg />,
  [SportType.SNOWBOARD]: () => <OtherImg />,
  [SportType.SNOWSHOE]: () => <OtherImg />,
  [SportType.SOCCER]: () => <OtherImg />,
  [SportType.SQUASH]: () => <OtherImg />,
  [SportType.STAIR_STEPPER]: () => <OtherImg />,
  [SportType.STAND_UP_PADDLING]: () => <OtherImg />,
  [SportType.SURFING]: () => <OtherImg />,
  [SportType.TABLE_TENNIS]: () => <OtherImg />,
  [SportType.TENNIS]: () => <OtherImg />,
  [SportType.TRAIL_RUN]: () => <OtherImg />,
  [SportType.VELOMOBILE]: () => <OtherImg />,
  [SportType.VIRTUAL_RIDE]: () => <OtherImg />,
  [SportType.VIRTUAL_ROW]: () => <OtherImg />,
  [SportType.VIRTUAL_RUN]: () => <OtherImg />,
  [SportType.WALK]: () => <RunningImg />,
  [SportType.WEIGHT_TRAINING]: () => <OtherImg />,
  [SportType.WHEELCHAIR]: () => <OtherImg />,
  [SportType.WINDSURF]: () => <OtherImg />,
  [SportType.WORKOUT]: () => <OtherImg />,
  [SportType.YOGA]: () => <OtherImg />,
};
