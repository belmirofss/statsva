import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "STATSVA.SHARE_CARD";

export type ShareCardStyle = "light" | "dark" | "orange" | "clear";

export type ShareCardPrefs = {
  style: ShareCardStyle;
  showRoute: boolean;
  showAthlete: boolean;
};

const DEFAULT_PREFS: ShareCardPrefs = {
  style: "light",
  showRoute: true,
  showAthlete: true,
};

/** The last share-card setup, remembered between sessions. */
export const useShareCardPrefs = () => {
  const [prefs, setPrefs] = useState<ShareCardPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((stored) => {
        if (stored) {
          setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
        }
      })
      .catch(() => {});
  }, []);

  const updatePrefs = (changes: Partial<ShareCardPrefs>) => {
    setPrefs((current) => {
      const next = { ...current, ...changes };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  return { prefs, updatePrefs };
};
