import { View } from "react-native";
import { Text } from "react-native-paper";
import { Logo } from "./Logo";
import { Theme } from "../theme";
import appInfo from "../../app.json";

export const AboutTheApp = () => {
  return (
    <>
      <View style={{ gap: Theme.space.s }}>
        <Text variant="headlineMedium" style={{ fontFamily: Theme.fonts.bold }}>
          All your data is saved exclusively on your device.
        </Text>
        <Text variant="titleMedium">
          Stats-va will never save or collect any information about you or your
          account.
        </Text>
        <Text variant="titleMedium">
          Stats-va is independent and has no relationship with Strava.
        </Text>
      </View>
      <Logo />
      <Text
        variant="labelLarge"
        style={{ fontFamily: Theme.fonts.bold, textAlign: "center" }}
      >
        Version: {appInfo.expo.version}
      </Text>
    </>
  );
};
