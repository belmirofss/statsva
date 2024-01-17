import { View } from "react-native";
import { Text } from "react-native-paper";
import { ReactElement, ReactNode } from "react";
import { Theme } from "../../theme";

type Props = {
  title: string;
  subTitle: string;
  children: ReactNode;
  renderIcon: () => ReactElement;
};

export const HomeStatsSection = ({
  title,
  subTitle,
  children,
  renderIcon,
}: Props) => {
  return (
    <View>
      <View
        style={{
          display: "flex",
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
      <View
        style={{
          marginTop: Theme.space.m,
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: Theme.space.s,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};
