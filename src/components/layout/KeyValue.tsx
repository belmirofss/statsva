import { View } from "react-native";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";

type Props = {
  text: string;
  value: string | number;
};

export const KeyValue = ({ text, value }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: Theme.colors.gray,
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
