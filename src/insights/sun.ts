const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const normalize = (value: number, max: number) => ((value % max) + max) % max;

/** Official zenith: the sun's upper edge on the horizon, with refraction. */
const ZENITH = 90.833;

/**
 * Sunrise or sunset in UTC hours for a calendar day and place, using the
 * Almanac for Computers algorithm (accurate to a minute or two). Undefined
 * during polar day or night.
 */
export function sunTimeUtc(
  date: string,
  latitude: number,
  longitude: number,
  rising: boolean
): number | undefined {
  const [year, month, day] = date.split("-").map(Number);
  const start = Date.UTC(year, 0, 0);
  const dayOfYear = Math.round((Date.UTC(year, month - 1, day) - start) / 86400000);

  const lngHour = longitude / 15;
  const t = dayOfYear + ((rising ? 6 : 18) - lngHour) / 24;
  const meanAnomaly = 0.9856 * t - 3.289;
  const trueLongitude = normalize(
    meanAnomaly +
      1.916 * Math.sin(toRad(meanAnomaly)) +
      0.02 * Math.sin(toRad(2 * meanAnomaly)) +
      282.634,
    360
  );

  let rightAscension = normalize(
    toDeg(Math.atan(0.91764 * Math.tan(toRad(trueLongitude)))),
    360
  );
  rightAscension +=
    Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
  rightAscension /= 15;

  const sinDec = 0.39782 * Math.sin(toRad(trueLongitude));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosHour =
    (Math.cos(toRad(ZENITH)) - sinDec * Math.sin(toRad(latitude))) /
    (cosDec * Math.cos(toRad(latitude)));

  if (cosHour > 1 || cosHour < -1) {
    return undefined;
  }

  const hourAngle =
    (rising ? 360 - toDeg(Math.acos(cosHour)) : toDeg(Math.acos(cosHour))) / 15;
  const localMean = hourAngle + rightAscension - 0.06571 * t - 6.622;
  return normalize(localMean - lngHour, 24);
}
