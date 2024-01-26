import { View } from "react-native";
import { SummaryActivity } from "../types";
import { Theme } from "../theme";
import { Map } from "./Map";
import React from "react";
import moment from "moment";
import { SPORT_TYPE_TO_ICON, SPORT_TYPE_TO_LABEL } from "../constants";
import { ListItemHeader } from "./ListItemHeader";
import { formatDistance, formatDistancePerHour, formatTime } from "../helpers";
import { Text } from "react-native-paper";
import { Chip } from "./Chip";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = React.memo(({ activity }: Props) => {
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

      <View style={{ flexDirection: "row", gap: Theme.space.s }}>
        <Chip title="Distance" content={formatDistance(activity.distance)} />
        <Chip title="Mov time" content={formatTime(activity.moving_time)} />
        <Chip
          title="Pace"
          content={formatDistancePerHour(
            activity.distance,
            activity.moving_time
          )}
        />
        <Chip
          title="Elevation"
          content={formatDistance(Number(activity.total_elevation_gain))}
        />
      </View>

      {activity.map && <Map polyline={activity.map.summary_polyline} />}
    </View>
  );
});
