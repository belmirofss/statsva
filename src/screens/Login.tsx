import { useEffect } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Text } from "react-native-paper";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Theme } from "../theme";
import { Logo } from "../components/imgs/Logo";
import { Button } from "../components/layout/Button";
import { useNavigation } from "@react-navigation/native";
import {
  AD_INTERSTITIAL_UNIT_ID,
  AUTHORIZATION_ENDPOINT_STRAVA,
  REVOCATION_ENDPOINT_STRAVA,
  STRAVA_CLIENT_ID,
  STRAVA_REDIRECT,
  STRAVA_SCOPES,
  TOKEN_ENDPOINT_STRAVA,
} from "../constants";
import { useAppContext } from "../hooks/useAppContext";
import { OverlayLoading } from "../components/layout/OverlayLoading";
import { InterstitialAd, TestIds } from "react-native-google-mobile-ads";

WebBrowser.maybeCompleteAuthSession();

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : AD_INTERSTITIAL_UNIT_ID;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {});

const discovery = {
  authorizationEndpoint: AUTHORIZATION_ENDPOINT_STRAVA,
  tokenEndpoint: TOKEN_ENDPOINT_STRAVA,
  revocationEndpoint: REVOCATION_ENDPOINT_STRAVA,
};

export const Login = () => {
  const { authenticate, isAuthenticating } = useAppContext();

  const [_, response, promptAsync] = useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      scopes: STRAVA_SCOPES,
      redirectUri: makeRedirectUri({
        native: STRAVA_REDIRECT,
      }),
    },
    discovery
  );

  const navigation = useNavigation();

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      authenticate(code);
    }
  }, [response]);

  useEffect(() => {
    // Pre-load interstitial ad
    interstitial.load();
  }, []);

  return (
    <ScreenContainer
      style={{
        justifyContent: "flex-end",
        gap: Theme.space.s,
      }}
    >
      <Logo />

      {isAuthenticating && (
        <OverlayLoading title="Connecting with your Strava account..." />
      )}

      <View style={{ gap: Theme.space.xs }}>
        <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
          Hello, welcome to Stats-va!
        </Text>
        <Text variant="titleMedium">
          Connect with your Strava account to see and share your stats
        </Text>
      </View>

      <View style={{ gap: Theme.space.s }}>
        <Button
          onPress={() => {
            promptAsync();
          }}
          disabled={isAuthenticating}
        >
          Connect with Strava
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("About")}
          disabled={isAuthenticating}
        >
          About the app
        </Button>
      </View>
    </ScreenContainer>
  );
};
