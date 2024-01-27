import { Text } from "react-native-paper";
import { View } from "react-native";
import { Theme } from "../theme";
import { TitleAndContent } from "../types";

type Props = TitleAndContent;

export const Chip = ({ title, content }: Props) => {
  return (
    <View
      style={{
        flexDirection: "column",
        padding: Theme.space.s,
        borderWidth: 1,
        borderColor: Theme.colors.darken,
        backgroundColor: Theme.colors.lightGray,
        borderRadius: 8,
      }}
    >
      <Text variant="labelSmall">{title}</Text>
      <Text style={{ fontFamily: Theme.fonts.bold }}>{content}</Text>
    </View>
  );
};
