import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { SummaryActivity } from "../types";
import { Theme } from "../theme";
import { Map } from "./Map";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = ({ activity }: Props) => {
  return (
    <List.Item
      title={() => (
        <View>
          <Text variant="titleSmall" style={{ fontFamily: Theme.fonts.bold }}>
            {activity.name}
          </Text>
        </View>
      )}
      description={() => (
        <View style={{ marginTop: Theme.space.s }}>
          <Map polyline={activity.map.summary_polyline} />
        </View>
      )}
      titleNumberOfLines={3}
      style={{
        backgroundColor: Theme.colors.contrast,
        marginBottom: Theme.space.m,
      }}
    />
  );
};
