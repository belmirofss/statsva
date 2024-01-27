import { View } from "react-native";
import { SummaryActivity, TitleAndContent } from "../types";
import { Theme } from "../theme";
import { Map } from "./Map";
import React from "react";
import moment from "moment";
import { SPORT_TYPE_TO_ICON, SPORT_TYPE_TO_LABEL } from "../constants";
import { ListItemHeader } from "./ListItemHeader";
import { Text } from "react-native-paper";
import { Chip } from "./Chip";
import {
  formatCalories,
  formatDistance,
  formatSpeed,
  formatTime,
  formatHeartrate,
} from "../helpers";
import { Button } from "./Button";
import { useNavigation } from "@react-navigation/native";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = React.memo(({ activity }: Props) => {
  const navigation = useNavigation();

  const chips: TitleAndContent[] = [
    {
      title: "Distance",
      content: formatDistance(activity.distance),
    },
    {
      title: "Mov time",
      content: formatTime(activity.moving_time),
    },
    {
      title: "Pace",
      content: formatSpeed(activity.average_speed),
    },
    {
      title: "Elevation",
      content: formatDistance(activity.total_elevation_gain),
    },
    {
      title: "Calories",
      content: formatCalories(activity.kilojoules),
    },
    {
      title: "Calories",
      content: formatHeartrate(activity.average_heartrate),
    },
  ]
    .filter(({ content }) => !!content)
    .slice(0, 3);

  return (
    <View
      style={{
        marginBottom: Theme.space.xl,
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
        gap: Theme.space.s,
      }}
    >
      <ListItemHeader
        title={SPORT_TYPE_TO_LABEL[activity.sport_type]}
        subTitle={moment(activity.start_date).format("lll")}
        renderIcon={SPORT_TYPE_TO_ICON[activity.sport_type]}
      />
      <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
        {activity.name}
      </Text>
      {!!chips.length && (
        <View style={{ flexDirection: "row", gap: Theme.space.s }}>
          {chips.map((chip) => (
            <Chip
              key={chip.title}
              title={chip.title}
              content={chip.content || ""}
            />
          ))}
        </View>
      )}
      {activity.map && <Map polyline={activity.map.summary_polyline} />}
      <Button
        mode="outlined"
        onPress={() => {
          navigation.navigate("Activity", { id: activity.id });
        }}
      >
        View more
      </Button>
    </View>
  );
});
