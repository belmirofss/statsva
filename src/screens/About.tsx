import { Linking, Platform, Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { Theme } from "../theme";
import { IconName, PLAY_STORE_URL, SOURCE_CODE_URL } from "../constants";
import { Logo } from "../components/imgs/Logo";
import { AppText } from "../components/layout/AppText";
import { Card } from "../components/layout/Card";
import { openBuyMeACoffee } from "../components/BuyMeACoffee";

const PRIVACY_POINTS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "cellphone",
    title: "Stays on your phone",
    body: "Your stats come straight from Strava to this device. Stats-va has no servers and keeps no copies.",
  },
  {
    icon: "eye-outline",
    title: "Read-only access",
    body: "It can read your activities, including private ones, but can't post, edit or delete anything.",
  },
  {
    icon: "link-variant-off",
    title: "Disconnected when you leave",
    body: "Logging out removes Stats-va from your Strava account, so no connection is left behind.",
  },
];

const openPlayStore = () =>
  Linking.openURL("market://details?id=com.yabcompany.statsva").catch(() =>
    Linking.openURL(PLAY_STORE_URL)
  );

const SUPPORT_LINKS: { icon: IconName; label: string; onPress: () => void }[] =
  [
    { icon: "coffee-outline", label: "Buy me a coffee", onPress: openBuyMeACoffee },
    {
      icon: "code-tags",
      label: "Source code",
      onPress: () => WebBrowser.openBrowserAsync(SOURCE_CODE_URL),
    },
    ...(Platform.OS === "android"
      ? [{ icon: "star-outline" as const, label: "Rate on Google Play", onPress: openPlayStore }]
      : []),
  ];

const version = [
  Constants.expoConfig?.version,
  Constants.expoConfig?.android?.versionCode &&
    `(${Constants.expoConfig.android.versionCode})`,
]
  .filter(Boolean)
  .join(" ");

export const About = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Theme.colors.background }}
      contentContainerStyle={{
        padding: Theme.gutter,
        paddingTop: Theme.space.l,
        paddingBottom: Theme.space.xl,
        gap: Theme.space.m,
      }}
    >
      <View style={{ alignItems: "center", gap: 6, paddingBottom: 4 }}>
        <Logo size={72} />
        <AppText bold size={24} style={{ marginTop: Theme.space.s }}>
          Stats-va
        </AppText>
        <AppText color={Theme.colors.textMuted}>
          See and share your Strava stats
        </AppText>
        {!!version && (
          <AppText size={12} color={Theme.colors.textMuted}>
            Version {version}
          </AppText>
        )}
      </View>

      <AppText
        bold
        size={18}
        accessibilityRole="header"
        style={{ marginTop: Theme.space.s }}
      >
        Your privacy
      </AppText>
      <Card style={{ paddingVertical: Theme.space.xs }}>
        {PRIVACY_POINTS.map((point, index) => (
          <View
            key={point.title}
            style={{
              flexDirection: "row",
              gap: 14,
              paddingVertical: 14,
              borderTopWidth: index ? 1 : 0,
              borderTopColor: Theme.colors.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: Theme.radius.m,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Theme.colors.primaryLight,
              }}
            >
              <MaterialCommunityIcons
                name={point.icon}
                size={22}
                color={Theme.colors.primaryDark}
              />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <AppText bold size={15}>
                {point.title}
              </AppText>
              <AppText color={Theme.colors.textMuted} style={{ lineHeight: 20 }}>
                {point.body}
              </AppText>
            </View>
          </View>
        ))}
      </Card>

      <AppText
        bold
        size={18}
        accessibilityRole="header"
        style={{ marginTop: Theme.space.s }}
      >
        Support the app
      </AppText>
      <Card style={{ paddingVertical: 0 }}>
        {SUPPORT_LINKS.map((link, index) => (
          <Pressable
            key={link.label}
            onPress={link.onPress}
            accessibilityRole="link"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              minHeight: 56,
              borderTopWidth: index ? 1 : 0,
              borderTopColor: Theme.colors.border,
            }}
          >
            <MaterialCommunityIcons
              name={link.icon}
              size={22}
              color={Theme.colors.primaryDark}
            />
            <AppText size={16} style={{ flex: 1 }}>
              {link.label}
            </AppText>
            <MaterialCommunityIcons
              name="open-in-new"
              size={18}
              color={Theme.colors.textMuted}
            />
          </Pressable>
        ))}
      </Card>

      <View style={{ alignItems: "center", gap: 4, paddingTop: Theme.space.s }}>
        <AppText bold size={12} color={Theme.colors.textMuted}>
          Powered by Strava
        </AppText>
        <AppText
          size={12}
          color={Theme.colors.textMuted}
          style={{ textAlign: "center" }}
        >
          Stats-va is independent and isn't affiliated with Strava.
        </AppText>
      </View>
    </ScrollView>
  );
};
