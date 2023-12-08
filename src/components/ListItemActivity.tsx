import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { SummaryActivity } from "../types";
import { Theme } from "../theme";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = ({ activity }: Props) => {
  return (
    <List.Item
      title={() => (
        <View>
          <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
            {activity.name}
          </Text>
        </View>
      )}
      description={() => <View></View>}
      titleNumberOfLines={2}
    />
  );
};
