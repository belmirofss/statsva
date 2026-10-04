import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { STRAVA_CLIENT_SECRET } from "@env";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  REVOCATION_ENDPOINT_STRAVA,
  STRAVA_CLIENT_ID,
  TOKEN_ENDPOINT_STRAVA,
} from "./constants";

const deauthorize = (accessToken: string) =>
  axios.post(REVOCATION_ENDPOINT_STRAVA, null, {
    params: { access_token: accessToken },
  });

const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post<{ access_token: string }>(
    TOKEN_ENDPOINT_STRAVA,
    null,
    {
      params: {
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET || process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    },
  );
  return response.data.access_token;
};

export const storeSession = async (
  accessToken: string,
  refreshToken: string,
) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const revokeStoredSession = async () => {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

  if (accessToken) {
    try {
      await deauthorize(accessToken);
      return;
    } catch {
      // Access tokens expire after 6h; fall back to the refresh token.
    }
  }

  if (refreshToken) {
    try {
      await deauthorize(await refreshAccessToken(refreshToken));
    } catch {
      // Already revoked by the athlete, or offline. Nothing else we can do.
    }
  }
};
