import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api";
import { Activity, SummaryActivity } from "../types";

const LIMITS_KEY = "STATSVA.GEAR_LIMITS";
export const DEFAULT_SHOE_LIMIT_KM = 800;
export const SHOE_LIMIT_OPTIONS_KM = [500, 600, 700, 800, 900, 1000];
/** Warn this far ahead of the limit. */
export const SHOE_WARNING_KM = 150;

export type GearKind = "shoe" | "bike";

export type GearItem = {
  id: string;
  kind: GearKind;
  name: string;
  /** Lifetime metres, as Strava tracks it. */
  distance: number;
  /** Activities with this gear since the start of last year. */
  count: number;
  lastUsed: string;
};

type Usage = {
  count: number;
  lastActivity: SummaryActivity;
};

/**
 * Strava ids shoes "g…" and bikes "b…". Names and lifetime distance come from
 * the latest activity that used each item, which needs no extra OAuth scope.
 */
export const useGear = (activities: SummaryActivity[] | undefined) => {
  const usage = useMemo(() => {
    const byGear = new Map<string, Usage>();
    // Newest first, so the first activity seen is the latest.
    (activities ?? []).forEach((activity) => {
      if (!activity.gear_id) return;
      const current = byGear.get(activity.gear_id);
      if (current) {
        current.count++;
      } else {
        byGear.set(activity.gear_id, { count: 1, lastActivity: activity });
      }
    });
    return [...byGear.entries()];
  }, [activities]);

  const details = useQueries({
    queries: usage.map(([, { lastActivity }]) => ({
      queryKey: ["ACTIVITY", lastActivity.id],
      queryFn: () => API.get<Activity>(`activities/${lastActivity.id}`),
    })),
  });

  const items: GearItem[] = usage
    .map(([id, { count, lastActivity }], index): GearItem | undefined => {
      const gear = details[index]?.data?.data.gear;
      if (!gear) return undefined;
      return {
        id,
        kind: id.startsWith("b") ? "bike" : "shoe",
        name: gear.name,
        distance: gear.distance,
        count,
        lastUsed: lastActivity.start_date_local,
      };
    })
    .filter((item): item is GearItem => !!item);

  return {
    items,
    isLoading: details.some((query) => query.isLoading),
    isError: details.some((query) => query.isError),
  };
};

/** Retire-at distance per shoe, remembered on this device. */
export const useShoeLimits = () => {
  const [limits, setLimits] = useState<Record<string, number>>({});

  useEffect(() => {
    AsyncStorage.getItem(LIMITS_KEY)
      .then((stored) => stored && setLimits(JSON.parse(stored)))
      .catch(() => {});
  }, []);

  const limitFor = (id: string) => limits[id] ?? DEFAULT_SHOE_LIMIT_KM;

  const setLimit = (id: string, km: number) => {
    setLimits((current) => {
      const next = { ...current, [id]: km };
      AsyncStorage.setItem(LIMITS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  return { limitFor, setLimit };
};
