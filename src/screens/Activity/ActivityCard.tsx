import { View } from "react-native";
import { Activity } from "../../types";
import { Theme } from "../../theme";
import { Map } from "../../components/Map";
import { Button } from "../../components/layout/Button";
import { ActivityHeader } from "../../components/ActivityHeader";
import { ActivityMainStats } from "./ActivityMainStats";
import { ActivitySecondaryStats } from "./ActivitySecondaryStats";

type Props = {
  activity: Activity;
};

export const ActivityCard = ({ activity }: Props) => {
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
        <ActivitySecondaryStats activity={activity} />
        <ActivityMainStats activity={activity} />
        {activity.map && <Map polyline={activity.map.summary_polyline} />}
      </View>

      <Button onPress={() => {}}>Share</Button>
    </View>
  );
};
