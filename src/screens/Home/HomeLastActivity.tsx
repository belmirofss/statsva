import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { SummaryActivity } from "../../types";
import { ListItemActivity } from "../../components/ListItemActivity";

type Props = {
  activity: SummaryActivity;
};

export const HomeLastActivity = ({ activity }: Props) => {
  return (
    <View
      style={{
        gap: Theme.space.l,
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
      }}
    >
      <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
        Last activity
      </Text>

      <ListItemActivity activity={activity} noPadding />
    </View>
  );
};
