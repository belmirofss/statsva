import { View } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Theme } from "../theme";
import { Text } from "react-native-paper";
import { Logo } from "../components/imgs/Logo";

export const About = () => {
  return (
    <ScreenContainer style={{ gap: Theme.space.s }}>
      <View style={{ gap: Theme.space.s }}>
        <Text variant="headlineSmall" style={{ fontFamily: Theme.fonts.bold }}>
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
      <Logo size={64} />
    </ScreenContainer>
  );
};
