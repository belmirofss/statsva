import axios from "axios";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { IconName } from "../constants";
import { SummaryActivity } from "../types";

/** The forecast API keeps ~3 months of past hours; older days come from the archive. */
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const FORECAST_PAST_DAYS = 80;

const HOURLY = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
] as const;

type HourlyKey = (typeof HOURLY)[number];

type OpenMeteoResponse = {
  hourly: { time: string[] } & Record<HourlyKey, (number | null)[]>;
};

export type HourWeather = {
  time: string;
  temperature: number;
};

export type ActivityWeather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  /** Millimetres over the activity's hours. */
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  icon: IconName;
  hours: HourWeather[];
};

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/** WMO weather interpretation codes, as Open-Meteo reports them. */
export function describeWeatherCode(code: number): { label: string; icon: IconName } {
  if (code === 0) return { label: "Clear sky", icon: "weather-sunny" };
  if (code <= 2) return { label: code === 1 ? "Mainly clear" : "Partly cloudy", icon: "weather-partly-cloudy" };
  if (code === 3) return { label: "Overcast", icon: "weather-cloudy" };
  if (code <= 48) return { label: "Fog", icon: "weather-fog" };
  if (code <= 57) return { label: "Drizzle", icon: "weather-rainy" };
  if (code <= 67) return { label: code >= 65 ? "Heavy rain" : "Rain", icon: code >= 65 ? "weather-pouring" : "weather-rainy" };
  if (code <= 77) return { label: "Snow", icon: "weather-snowy" };
  if (code <= 82) return { label: "Rain showers", icon: "weather-pouring" };
  if (code <= 86) return { label: "Snow showers", icon: "weather-snowy-heavy" };
  return { label: "Thunderstorm", icon: "weather-lightning-rainy" };
}

const hourKey = (time: moment.Moment) => time.format("YYYY-MM-DDTHH:00");

/** Weather has a place and time to look up: outdoor, recorded with GPS. */
export const hasWeather = (activity: SummaryActivity) =>
  !activity.trainer &&
  !activity.manual &&
  Array.isArray(activity.start_latlng) &&
  activity.start_latlng.length === 2;

async function fetchWeather(activity: SummaryActivity): Promise<ActivityWeather | null> {
  const [latitude, longitude] = activity.start_latlng;
  // Local wall-clock times, matching Open-Meteo's `timezone=auto` hours.
  const start = moment.utc(activity.start_date_local);
  const end = start.clone().add(activity.elapsed_time, "seconds");
  const recent = moment().diff(start, "days") < FORECAST_PAST_DAYS;

  const { data } = await axios.get<OpenMeteoResponse>(
    recent ? FORECAST_URL : ARCHIVE_URL,
    {
      params: {
        latitude: latitude.toFixed(3),
        longitude: longitude.toFixed(3),
        start_date: start.format("YYYY-MM-DD"),
        end_date: end.format("YYYY-MM-DD"),
        hourly: HOURLY.join(","),
        timezone: "auto",
        wind_speed_unit: "kmh",
      },
    }
  );

  const times = data.hourly.time;
  const nearest = start.clone().add(30, "minutes").startOf("hour");
  const index = times.indexOf(hourKey(nearest));
  const value = (key: HourlyKey, i = index) => data.hourly[key][i];
  const temperature = value("temperature_2m");
  if (index < 0 || temperature == null) {
    return null;
  }

  const hours: HourWeather[] = [];
  let precipitation = 0;
  for (
    const cursor = start.clone().startOf("hour");
    !cursor.isAfter(end);
    cursor.add(1, "hour")
  ) {
    const i = times.indexOf(hourKey(cursor));
    const temp = i >= 0 ? value("temperature_2m", i) : null;
    if (temp != null) {
      hours.push({ time: cursor.format("HH:mm"), temperature: temp });
      precipitation += value("precipitation", i) ?? 0;
    }
  }

  const direction = value("wind_direction_10m") ?? 0;
  const { label, icon } = describeWeatherCode(value("weather_code") ?? 0);

  return {
    temperature,
    feelsLike: value("apparent_temperature") ?? temperature,
    humidity: value("relative_humidity_2m") ?? 0,
    precipitation,
    windSpeed: value("wind_speed_10m") ?? 0,
    windDirection: COMPASS[Math.round(direction / 45) % 8],
    condition: label,
    icon,
    hours,
  };
}

/**
 * Conditions at the start of an outdoor activity, from Open-Meteo (free, no
 * key). Only the start point and time leave the device.
 */
export const useActivityWeather = (activity?: SummaryActivity) => {
  return useQuery({
    queryKey: ["ACTIVITY_WEATHER", activity?.id],
    queryFn: () => fetchWeather(activity as SummaryActivity),
    enabled: !!activity && hasWeather(activity),
    staleTime: Infinity,
    retry: false,
  });
};
