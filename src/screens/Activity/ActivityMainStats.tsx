import { KeyValueList } from "../../components/layout/KeyValueList";
import { formatDistance, formatSpeed, formatTime } from "../../helpers";
import { Activity, TitleAndContent } from "../../types";

type Props = {
  activity: Activity;
};

export const ActivityMainStats = ({ activity }: Props) => {
  const stats: TitleAndContent[] = [
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

  if (!stats.length) {
    return null;
  }

  return <KeyValueList data={stats} />;
};
