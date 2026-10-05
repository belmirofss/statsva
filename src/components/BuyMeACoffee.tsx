import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BUY_ME_A_COFFEE_URL } from "../constants";
import { Theme } from "../theme";
import { AppText } from "./layout/AppText";

const KEY = "STATSVA.BUY_ME_A_COFFEE";
const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

export const openBuyMeACoffee = () =>
  WebBrowser.openBrowserAsync(BUY_ME_A_COFFEE_URL);

export const BuyMeACoffe = () => {
  const [visible, setVisible] = useState(false);

  const dismiss = () => {
    setVisible(false);
    AsyncStorage.setItem(KEY, new Date().toISOString());
  };

  const loadVisible = async () => {
    const dismissDate: string = (await AsyncStorage.getItem(KEY)) || "";
    const diff = new Date().getTime() - new Date(dismissDate).getTime();

    setVisible(Boolean(!dismissDate || diff > SEVEN_DAYS_MS));
  };

  useEffect(() => {
    loadVisible();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: Theme.gutter,
        borderRadius: Theme.radius.l,
        backgroundColor: Theme.colors.surface,
      }}
    >
      <Pressable
        onPress={openBuyMeACoffee}
        accessibilityRole="link"
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: Theme.space.m,
          minHeight: 56,
          paddingLeft: Theme.space.m,
        }}
      >
        <MaterialCommunityIcons
          name="coffee-outline"
          size={22}
          color={Theme.colors.primaryDark}
        />
        <AppText style={{ flex: 1 }}>
          <AppText bold>Enjoying Stats-va? </AppText>
          <AppText color={Theme.colors.textMuted}>Buy me a coffee</AppText>
        </AppText>
      </Pressable>
      <Pressable
        onPress={dismiss}
        accessibilityRole="button"
        accessibilityLabel="Hide for a week"
        style={{
          width: 48,
          height: 56,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="close"
          size={20}
          color={Theme.colors.textMuted}
        />
      </Pressable>
    </View>
  );
};
