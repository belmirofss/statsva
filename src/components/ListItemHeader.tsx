import { View } from "react-native";
import { Theme } from "../theme";
import { Text } from "react-native-paper";
import { ReactElement } from "react";

type Props = {
  title: string;
  subTitle: string;
  renderIcon: () => ReactElement;
};

export const ListItemHeader = ({ title, subTitle, renderIcon }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftColor: Theme.colors.primary,
        borderLeftWidth: 4,
        borderRightColor: Theme.colors.primary,
        borderRightWidth: 4,
        paddingHorizontal: Theme.space.s,
        paddingVertical: Theme.space.xs,
      }}
    >
      <View>
        <Text
          variant="titleMedium"
          style={{
            fontFamily: Theme.fonts.bold,
          }}
        >
          {title}
        </Text>
        <Text variant="titleSmall">{subTitle}</Text>
      </View>

      {renderIcon()}
    </View>
  );
};
