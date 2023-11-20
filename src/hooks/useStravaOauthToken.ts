import { useMutation } from "react-query";
import API from "../api";
import { STRAVA_CLIENT_DEVELOPMENT, STRAVA_CLIENT_ID } from "../constants";
import { SummaryAthlete } from "../types";
import { STRAVA_CLIENT_SECRET } from "@env";

type Response = {
  token_type: string;
  expires_at: string;
  expires_in: string;
  refresh_token: string;
  access_token: string;
  athlete: SummaryAthlete;
};

export const useStravaOauthToken = () => {
  return useMutation("OAUTH_TOKEN", ({ code }: { code: string }) =>
    API.post<Response>(
      "/oauth/token",
      {},
      {
        params: {
          client_id: __DEV__ ? STRAVA_CLIENT_DEVELOPMENT : STRAVA_CLIENT_ID,
          client_secret:
            STRAVA_CLIENT_SECRET || process.env.STRAVA_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
        },
      }
    )
  );
};
