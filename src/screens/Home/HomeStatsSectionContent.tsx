import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";

type Props = {
  text: string;
  value: string;
};

export const HomeStatsSectionContent = ({ text, value }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: Theme.colors.placeholder,
        borderBottomWidth: 1,
        paddingBottom: Theme.space.xs,
      }}
    >
      <Text variant="bodyMedium" style={{ fontFamily: Theme.fonts.bold }}>
        {text}
      </Text>
      <Text
        variant="titleLarge"
        style={{
          color: Theme.colors.primary,
          fontFamily: Theme.fonts.bold,
        }}
      >
        {value}
      </Text>
    </View>
  );
};
