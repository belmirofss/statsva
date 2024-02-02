import { View } from "react-native";
import { Chip } from "../../components/layout/Chip";
import { formatCalories, formatHeartrate, formatSpeed } from "../../helpers";
import { Activity, TitleAndContent } from "../../types";
import { Theme } from "../../theme";

type Props = {
  activity: Activity;
};

export const ActivitySecondaryStats = ({ activity }: Props) => {
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

  if (!chips.length) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", gap: Theme.space.s }}>
      {chips.map((item) => (
        <Chip key={item.title} title={item.title} content={item.content} />
      ))}
    </View>
  );
};
