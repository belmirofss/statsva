import { View } from "react-native";
import { Activity, TitleAndContent } from "../../types";
import { Theme } from "../../theme";
import { SPORT_TYPE_TO_LABEL } from "../../constants";
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
import { ActivityHeader } from "../../components/ActivityHeader";

type Props = {
  activity: Activity;
};

export const ActivityCard = ({ activity }: Props) => {
  const keyValueList: TitleAndContent[] = [
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
  ].filter(({ content }) => !!content);

  const chips: TitleAndContent[] = [
    {
      title: "Max speed",
      content: formatSpeed(activity.max_speed),
    },
    {
      title: "Calories",
      content: formatCalories(activity.calories),
    },
    {
      title: "Heartrate",
      content: formatHeartrate(activity.average_heartrate),
    },
  ].filter(({ content }) => !!content);

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
        <ActivityHeader activity={activity} />

        {!!chips.length && (
          <View style={{ flexDirection: "row", gap: Theme.space.s }}>
            {chips.map((item) => (
              <Chip
                key={item.title}
                title={item.title}
                content={item.content}
              />
            ))}
          </View>
        )}

        {!!keyValueList.length && <KeyValueList data={keyValueList} />}

        {activity.map && <Map polyline={activity.map.summary_polyline} />}
      </View>

      <Button onPress={() => {}}>Share</Button>
    </View>
  );
};
