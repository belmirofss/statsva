import { View } from "react-native";
import { Text } from "react-native-paper";
import { ReactElement, ReactNode } from "react";
import { Theme } from "../../theme";
import { ListItemHeader } from "../../components/ListItemHeader";

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
      <ListItemHeader
        title={title}
        subTitle={subTitle}
        renderIcon={renderIcon}
      />
      <View
        style={{
          marginTop: Theme.space.m,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
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
