import moment from "moment";
import { SportType } from "./types";

const PACE_PER_KM_SPORTS = [
  SportType.RUN,
  SportType.TRAIL_RUN,
  SportType.VIRTUAL_RUN,
  SportType.WALK,
  SportType.HIKE,
];

export function formatNumber(value: number, decimals = 0) {
  const [integer, fraction] = value.toFixed(decimals).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}

export function formatDistance(meters: number | undefined) {
  if (!meters) {
    return;
  }

  if (meters < 1000) {
    return meters.toFixed(0).concat(" m");
  }

  const km = meters / 1000;
  return formatNumber(km, km >= 1000 ? 0 : 1).concat(" km");
}

export function formatKilometers(meters: number | undefined) {
  if (!meters) {
    return;
  }

  const km = meters / 1000;
  return formatNumber(km, km >= 1000 ? 0 : 1);
}

export function formatElevation(meters: number | undefined) {
  if (!meters) {
    return;
  }

  return formatNumber(meters).concat(" m");
}

export function formatTime(seconds: number | undefined) {
  if (!seconds) {
    return;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const pad = (value: number) => String(value).padStart(2, "0");

  if (!hours) {
    return `${minutes}:${pad(remainingSeconds)}`;
  }

  return `${hours}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

export function formatDuration(seconds: number | undefined) {
  if (!seconds) {
    return;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 100) {
    return `${formatNumber(hours)}h`;
  }

  if (hours) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(Math.floor(seconds % 60)).padStart(2, "0")}s`;
}

export function formatSpeed(speedInMS: number | undefined) {
  if (!speedInMS) {
    return;
  }

  return (speedInMS * 3.6).toFixed(1).concat(" km/h");
}

function formatPace(secondsPerUnit: number, unit: string) {
  const rounded = Math.round(secondsPerUnit);
  const minutes = Math.floor(rounded / 60);
  const seconds = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${seconds} ${unit}`;
}

export function isSwim(sportType: SportType) {
  return sportType === SportType.SWIM;
}

export function usesPace(sportType: SportType) {
  return isSwim(sportType) || PACE_PER_KM_SPORTS.includes(sportType);
}

/**
 * Runs, walks and hikes read as min/km, swims as min/100m, everything else
 * as km/h.
 */
export function formatSpeedForSport(
  sportType: SportType,
  speedInMS: number | undefined
) {
  if (!speedInMS) {
    return;
  }

  if (isSwim(sportType)) {
    return formatPace(100 / speedInMS, "/100m");
  }

  if (PACE_PER_KM_SPORTS.includes(sportType)) {
    return formatPace(1000 / speedInMS, "/km");
  }

  return formatSpeed(speedInMS);
}

export function speedLabelForSport(sportType: SportType, prefix = "Avg") {
  return usesPace(sportType) ? `${prefix} pace` : `${prefix} speed`;
}

export function formatCalories(calories: number | undefined) {
  if (!calories) {
    return;
  }

  return formatNumber(calories).concat(" kcal");
}

export function formatHeartrate(heartrate: number | undefined | null) {
  if (!heartrate) {
    return;
  }

  return heartrate.toFixed(0).concat(" bpm");
}

export function formatWatts(watts: number | undefined | null) {
  if (!watts) {
    return;
  }

  return watts.toFixed(0).concat(" W");
}

/** Strava's `start_date_local` is the athlete's wall-clock time, tagged as UTC. */
export function activityLocalMoment(startDateLocal: string) {
  return moment.utc(startDateLocal);
}

export function formatActivityDate(startDateLocal: string) {
  const date = activityLocalMoment(startDateLocal);
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");
  const day = date.format("YYYY-MM-DD");

  if (day === today) {
    return `Today, ${date.format("HH:mm")}`;
  }

  if (day === yesterday) {
    return `Yesterday, ${date.format("HH:mm")}`;
  }

  return date.format("ddd, MMM D");
}
