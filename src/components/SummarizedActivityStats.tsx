import { View } from "react-native";
import {
  formatDistance,
  formatHeartrate,
  formatSpeed,
  formatTime,
} from "../helpers";
import { Activity, SummaryActivity, TitleAndContent } from "../types";
import { Theme } from "../theme";
import { Chip } from "./layout/Chip";

type Props = {
  activity: Activity | SummaryActivity;
};

export const SummarizedActivityStats = ({ activity }: Props) => {
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
      title: "Speed",
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

  if (!chips.length) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", gap: Theme.space.s }}>
      {chips.map((chip) => (
        <Chip
          key={chip.title}
          title={chip.title}
          content={chip.content || ""}
        />
      ))}
    </View>
  );
};
