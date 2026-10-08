import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SummaryActivity } from "../types";

const CACHE_KEY = "STATSVA.PLACES";
const GEOCODE_URL = "https://api-bdc.io/data/reverse-geocode-client";
/** Start points are grouped on a ~10 km grid, so a city is looked up once. */
const GRID = 10;
const MAX_LOOKUPS = 60;

export type Place = {
  city: string;
  country: string;
  countryCode: string;
};

export type CountryVisit = {
  country: string;
  countryCode: string;
  cities: string[];
  count: number;
};

type Response = {
  city?: string;
  locality?: string;
  countryName?: string;
  countryCode?: string;
};

const cellOf = ([lat, lng]: [number, number]) =>
  `${Math.round(lat * GRID) / GRID},${Math.round(lng * GRID) / GRID}`;

/** Looks up a real start point: a cell's centre can land in a river or bay. */
async function lookup([latitude, longitude]: [number, number]): Promise<Place | null> {
  const { data } = await axios.get<Response>(GEOCODE_URL, {
    params: {
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      localityLanguage: "en",
    },
  });
  if (!data.countryName) return null;
  return {
    city: data.city || data.locality || "",
    country: data.countryName,
    countryCode: data.countryCode ?? "",
  };
}

/**
 * Countries and cities from activity start points, via BigDataCloud's free
 * client-side reverse geocoder. Results are cached on the device by grid
 * cell, since places don't move.
 */
export const usePlaces = (activities: SummaryActivity[] | undefined) => {
  const located = (activities ?? []).filter(
    (activity) => activity.start_latlng?.length === 2
  );
  const points = new Map<string, [number, number]>();
  located.forEach((a) => {
    const cell = cellOf(a.start_latlng);
    if (!points.has(cell)) points.set(cell, a.start_latlng);
  });
  const cells = [...points.keys()].sort();

  return useQuery({
    queryKey: ["PLACES", cells],
    enabled: !!activities,
    staleTime: Infinity,
    queryFn: async () => {
      const cache: Record<string, Place | null> = JSON.parse(
        (await AsyncStorage.getItem(CACHE_KEY).catch(() => null)) ?? "{}"
      );

      const missing = cells.filter((cell) => !(cell in cache));
      for (const cell of missing.slice(0, MAX_LOOKUPS)) {
        try {
          cache[cell] = await lookup(points.get(cell)!);
        } catch {
          // Offline or rate limited: try again next time.
        }
      }
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache)).catch(() => {});

      const countries = new Map<string, CountryVisit & { citySet: Set<string> }>();
      located.forEach((activity) => {
        const place = cache[cellOf(activity.start_latlng)];
        if (!place) return;
        const visit = countries.get(place.country) ?? {
          country: place.country,
          countryCode: place.countryCode,
          cities: [],
          citySet: new Set<string>(),
          count: 0,
        };
        visit.count++;
        if (place.city) visit.citySet.add(place.city);
        countries.set(place.country, visit);
      });

      return [...countries.values()]
        .map(({ citySet, ...visit }) => ({ ...visit, cities: [...citySet] }))
        .sort((a, b) => b.count - a.count);
    },
  });
};
