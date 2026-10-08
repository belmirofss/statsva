import moment from "moment";
import { SummaryActivity } from "../types";
import { dayKey, localStartHour, utcOffsetHours } from "./dates";
import { sunTimeUtc } from "./sun";

export type Persona = {
  title: string;
  caption: string;
};

export type TimeProfile = {
  count: number;
  hours: number[];
  /** Monday first. */
  weekdays: number[];
  favouriteHour: number;
  persona: Persona;
  /** Started within half an hour of sunrise. */
  sunriseCount: number;
  /** Started before sunrise or finished after sunset. */
  darkCount: number;
};

const share = (hours: number[], from: number, to: number, count: number) =>
  hours.slice(from, to).reduce((sum, n) => sum + n, 0) / count;

function persona(hours: number[], count: number): Persona {
  const percent = (value: number) => `${Math.round(value * 100)}%`;
  const early = share(hours, 0, 8, count);
  const lunch = share(hours, 11, 14, count);
  const evening = share(hours, 18, 24, count);

  if (early >= 0.4) {
    return { title: "Early bird", caption: `${percent(early)} start before 8:00` };
  }
  if (evening >= 0.4) {
    return { title: "Night owl", caption: `${percent(evening)} start after 18:00` };
  }
  if (lunch >= 0.3) {
    return { title: "Lunch breaker", caption: `${percent(lunch)} start between 11:00 and 14:00` };
  }
  return { title: "Anytime athlete", caption: "No single time of day dominates" };
}

export function timeProfile(activities: SummaryActivity[]): TimeProfile {
  const hours = Array<number>(24).fill(0);
  const weekdays = Array<number>(7).fill(0);
  let sunriseCount = 0;
  let darkCount = 0;

  activities.forEach((activity) => {
    const start = localStartHour(activity);
    hours[Math.floor(start)]++;
    weekdays[moment.utc(activity.start_date_local).isoWeekday() - 1]++;

    const [lat, lng] = activity.start_latlng ?? [];
    if (typeof lat !== "number" || typeof lng !== "number") {
      return;
    }

    const offset = utcOffsetHours(activity);
    const sunriseUtc = sunTimeUtc(dayKey(activity), lat, lng, true);
    const sunsetUtc = sunTimeUtc(dayKey(activity), lat, lng, false);
    if (sunriseUtc === undefined || sunsetUtc === undefined) {
      return;
    }

    const sunrise = (sunriseUtc + offset + 24) % 24;
    const sunset = (sunsetUtc + offset + 24) % 24;
    const end = start + activity.elapsed_time / 3600;

    if (Math.abs(start - sunrise) <= 0.5) {
      sunriseCount++;
    }
    if (start < sunrise - 0.25 || end > sunset + 0.25) {
      darkCount++;
    }
  });

  const favouriteHour = hours.indexOf(Math.max(...hours));

  return {
    count: activities.length,
    hours,
    weekdays,
    favouriteHour,
    persona: activities.length
      ? persona(hours, activities.length)
      : { title: "No activities yet", caption: "" },
    sunriseCount,
    darkCount,
  };
}
