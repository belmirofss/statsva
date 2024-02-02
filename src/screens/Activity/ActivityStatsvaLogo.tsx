import { View } from "react-native";
import { Theme } from "../../theme";
import { Logo } from "../../components/imgs/Logo";
import { Text } from "react-native-paper";

export const ActivityStatsvaLogo = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Theme.space.xs,
      }}
    >
      <Logo size={36} />
      <Text
        variant="labelMedium"
        style={{
          fontFamily: Theme.fonts.bold,
          color: Theme.colors.primary,
        }}
      >
        Stats-va
      </Text>
    </View>
  );
};
