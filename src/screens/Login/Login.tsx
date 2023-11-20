import { useEffect } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Text } from "react-native-paper";
import { DEVELOPMENT_ADDRESS_REDIRECT } from "@env";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Theme } from "../../theme";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import {
  AUTHORIZATION_ENDPOINT_STRAVA,
  REVOCATION_ENDPOINT_STRAVA,
  STRAVA_CLIENT_DEVELOPMENT,
  STRAVA_CLIENT_ID,
  STRAVA_REDIRECT,
  STRAVA_SCOPES,
  TOKEN_ENDPOINT_STRAVA,
} from "../../constants";
import { useAppContext } from "../../hooks/useAppContext";
import { OverlayLoading } from "../../components/OverlayLoading";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: AUTHORIZATION_ENDPOINT_STRAVA,
  tokenEndpoint: TOKEN_ENDPOINT_STRAVA,
  revocationEndpoint: REVOCATION_ENDPOINT_STRAVA,
};

export const Login = () => {
  const { authenticate, isAuthenticating } = useAppContext();

  const [_, response, promptAsync] = useAuthRequest(
    {
      clientId: __DEV__ ? STRAVA_CLIENT_DEVELOPMENT : STRAVA_CLIENT_ID,
      scopes: STRAVA_SCOPES,
      redirectUri: makeRedirectUri({
        native: __DEV__ ? DEVELOPMENT_ADDRESS_REDIRECT : STRAVA_REDIRECT,
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
          Hello! Are you looking for your stats?
        </Text>
        <Text variant="titleMedium">
          Connect with your Strava account to see your stats
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
