import { View } from "react-native";
import { Text } from "react-native-paper";
import appInfo from "../../../app.json";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Theme } from "../../theme";
import { Logo } from "../../components/Logo";

export const About = () => {
  return (
    <ScreenContainer style={{ gap: Theme.space.s }}>
      <View style={{ gap: Theme.space.s }}>
        <Text variant="headlineMedium" style={{ fontFamily: Theme.fonts.bold }}>
          All your data is saved exclusively on your device.
        </Text>
        <Text variant="titleMedium">
          Statsva will never save or collect any information about you or your
          account.
        </Text>
        <Text variant="titleMedium">
          Statsva is independent and has no relationship with Strava.
        </Text>
      </View>
      <Logo />
      <Text
        variant="labelLarge"
        style={{ fontFamily: Theme.fonts.bold, textAlign: "center" }}
      >
        Version: {appInfo.expo.version}
      </Text>
    </ScreenContainer>
  );
};
