import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../theme";
import { Logo } from "../../components/imgs/Logo";
import { AppText } from "../../components/layout/AppText";
import {
  AUTHORIZATION_ENDPOINT_STRAVA,
  REVOCATION_ENDPOINT_STRAVA,
  STRAVA_CLIENT_ID,
  STRAVA_REDIRECT,
  STRAVA_SCOPES,
  TOKEN_ENDPOINT_STRAVA,
} from "../../constants";
import { useAppContext } from "../../hooks/useAppContext";
import { LoginPreview } from "./LoginPreview";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: AUTHORIZATION_ENDPOINT_STRAVA,
  tokenEndpoint: TOKEN_ENDPOINT_STRAVA,
  revocationEndpoint: REVOCATION_ENDPOINT_STRAVA,
};

export const Login = () => {
  const { authenticate, isAuthenticating, isErrorOnAuthentication } =
    useAppContext();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isWaitingForStrava, setIsWaitingForStrava] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      scopes: STRAVA_SCOPES,
      redirectUri: makeRedirectUri({
        native: STRAVA_REDIRECT,
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      authenticate(code);
    }
  }, [response]);

  const connect = async () => {
    setIsWaitingForStrava(true);
    try {
      await promptAsync();
    } finally {
      setIsWaitingForStrava(false);
    }
  };

  const isBusy = isWaitingForStrava || isAuthenticating;
  const busyLabel = isAuthenticating
    ? "Connecting your account…"
    : "Waiting for Strava…";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Theme.colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + Theme.space.l,
        paddingBottom: insets.bottom + Theme.space.l,
        paddingHorizontal: Theme.space.l,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Logo size={32} />
        <AppText bold size={18}>
          Stats-va
        </AppText>
      </View>

      <LoginPreview />

      <View style={{ flex: 1, justifyContent: "flex-end", gap: 14 }}>
        <AppText
          bold
          size={30}
          accessibilityRole="header"
          style={{ lineHeight: 34, letterSpacing: -0.5 }}
        >
          Your Strava stats, made to share
        </AppText>
        <AppText size={15} color={Theme.colors.textMuted} style={{ lineHeight: 22 }}>
          See your totals, spot your streaks and post a styled card of any
          ride, run or swim.
        </AppText>

        <Pressable
          onPress={connect}
          disabled={isBusy || !request}
          accessibilityRole="button"
          accessibilityState={{ busy: isBusy, disabled: isBusy || !request }}
          style={({ pressed }) => ({
            marginTop: Theme.space.s,
            height: 54,
            borderRadius: Theme.radius.l,
            backgroundColor: isBusy
              ? Theme.colors.primaryLight
              : Theme.colors.primary,
            opacity: pressed ? 0.85 : 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          })}
        >
          {isBusy && (
            <ActivityIndicator size="small" color={Theme.colors.primaryDark} />
          )}
          <AppText
            bold
            size={16}
            color={isBusy ? Theme.colors.primaryDark : Theme.colors.white}
          >
            {isBusy ? busyLabel : "Connect with Strava"}
          </AppText>
        </Pressable>

        {isWaitingForStrava && (
          <AppText
            size={13}
            color={Theme.colors.textMuted}
            style={{ textAlign: "center" }}
          >
            Approve access on the Strava page that just opened.
          </AppText>
        )}
        {isErrorOnAuthentication && !isBusy && (
          <AppText
            size={13}
            color={Theme.colors.red}
            style={{ textAlign: "center" }}
            accessibilityLiveRegion="polite"
          >
            Couldn't connect to Strava. Please try again.
          </AppText>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <MaterialCommunityIcons
            name="lock-outline"
            size={16}
            color={Theme.colors.textMuted}
          />
          <AppText size={13} color={Theme.colors.textMuted}>
            Read-only access. Nothing leaves your phone.
          </AppText>
        </View>

        <Pressable
          onPress={() => navigation.navigate("About")}
          accessibilityRole="link"
          style={{ alignSelf: "center", minHeight: 44, justifyContent: "center" }}
        >
          <AppText bold size={15} color={Theme.colors.primaryDark}>
            About Stats-va
          </AppText>
        </Pressable>
      </View>
    </ScrollView>
  );
};
