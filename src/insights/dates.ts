import moment, { Moment } from "moment";
import { SummaryActivity } from "../types";

/**
 * Insights work on calendar days in the athlete's own wall-clock time. Every
 * date here is a UTC moment at midnight of that day, so day arithmetic never
 * trips over the device's time zone or daylight saving.
 */
export const DAY_FORMAT = "YYYY-MM-DD";

export const dayKey = (activity: SummaryActivity) =>
  activity.start_date_local.slice(0, 10);

export const asDay = (key: string) => moment.utc(key, DAY_FORMAT);

export const today = () => moment.utc(moment().format(DAY_FORMAT), DAY_FORMAT);

export const dayIndex = (key: string, start: Moment) =>
  asDay(key).diff(start, "days");

/** Fractional hour of the day the activity started, local time. */
export const localStartHour = (activity: SummaryActivity) => {
  const time = moment.utc(activity.start_date_local);
  return time.hours() + time.minutes() / 60;
};

/** Hours between local wall-clock time and UTC at the activity's start. */
export const utcOffsetHours = (activity: SummaryActivity) =>
  moment
    .utc(activity.start_date_local)
    .diff(moment.utc(activity.start_date), "minutes") / 60;

export const formatHour = (hour: number) => {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  const minutes = Math.round((hour - Math.floor(hour)) * 60);
  return `${String(h).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
};

export const formatHourRange = (hour: number) => {
  const label = (h: number) => {
    const normal = h % 24;
    if (normal === 0) return "12 am";
    if (normal === 12) return "12 pm";
    return normal < 12 ? `${normal} am` : `${normal - 12} pm`;
  };
  return `${label(hour).replace(/ (am|pm)$/, "")}–${label(hour + 1)}`;
};
