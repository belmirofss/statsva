import React from "react";
import { View } from "react-native";
import { SummaryActivity, TitleAndContent } from "../../types";
import { Theme } from "../../theme";
import { Map } from "../../components/Map";
import { Chip } from "../../components/Chip";
import {
  formatDistance,
  formatSpeed,
  formatTime,
  formatHeartrate,
} from "../../helpers";
import { Button } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { ActivityHeader } from "../../components/ActivityHeader";

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
      title: "Heartrate",
      content: formatHeartrate(activity.average_heartrate),
    },
  ]
    .filter(({ content }) => !!content)
    .slice(0, 3);

  return (
    <View
      style={{
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
        gap: Theme.space.s,
      }}
    >
      <ActivityHeader activity={activity} />

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
        mode="contained"
        onPress={() => {
          navigation.navigate("Activity", { id: activity.id });
        }}
      >
        View more
      </Button>
    </View>
  );
});
