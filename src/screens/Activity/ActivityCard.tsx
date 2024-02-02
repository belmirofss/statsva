import { View } from "react-native";
import { SummaryActivity, TitleAndContent } from "../../types";
import { Theme } from "../../theme";
import { SPORT_TYPE_TO_ICON, SPORT_TYPE_TO_LABEL } from "../../constants";
import { Text } from "react-native-paper";
import moment from "moment";
import { Chip } from "../../components/Chip";
import {
  formatCalories,
  formatDistance,
  formatHeartrate,
  formatSpeed,
  formatTime,
} from "../../helpers";
import { KeyValueList } from "../../components/KeyValueList";
import { Map } from "../../components/Map";
import { Button } from "../../components/Button";

type Props = {
  activity: SummaryActivity;
};

export const ActivityCard = ({ activity }: Props) => {
  const keyValueList: TitleAndContent[] = activity
    ? [
        {
          title: "Distance",
          content: formatDistance(activity.distance),
        },
        {
          title: "Moving time",
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
      ].filter(({ content }) => !!content)
    : [];

  return (
    <View
      style={{
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
        gap: Theme.space.m,
      }}
    >
      <View
        style={{
          gap: Theme.space.s,
          backgroundColor: Theme.colors.contrast,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
          }}
        >
          {SPORT_TYPE_TO_ICON[activity.sport_type]()}
          <Text
            variant="labelSmall"
            style={{
              fontFamily: Theme.fonts.bold,
            }}
          >
            {moment(activity.start_date).format("lll")}
          </Text>
          <Text
            variant="headlineSmall"
            style={{
              fontFamily: Theme.fonts.bold,
              lineHeight: 24,
            }}
          >
            {activity.name}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: Theme.space.s }}>
          <Chip
            title="Type"
            content={SPORT_TYPE_TO_LABEL[activity.sport_type]}
          />
          <Chip
            title="Calories"
            content={formatCalories(activity.kilojoules)}
          />
          <Chip
            title="Heartrate"
            content={formatHeartrate(activity.average_heartrate)}
          />
        </View>

        <KeyValueList data={keyValueList} />

        {activity.map && <Map polyline={activity.map.summary_polyline} />}
      </View>

      <Button onPress={() => {}}>Share</Button>
    </View>
  );
};
