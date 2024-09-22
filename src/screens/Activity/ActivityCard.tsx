import ViewShot from "react-native-view-shot";
import { View } from "react-native";
import { Activity } from "../../types";
import { Theme } from "../../theme";
import { Map } from "../../components/Map";
import { Button } from "../../components/layout/Button";
import { ActivityHeader } from "../../components/ActivityHeader";
import { ActivityMainStats } from "./ActivityMainStats";
import { ActivitySecondaryStats } from "./ActivitySecondaryStats";
import { ShareBottom } from "../../components/ShareBottom";
import { useShare } from "../../hooks/useShare";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_ACTIVITY_UNIT_ID } from "../../constants";

type Props = {
  activity: Activity;
};

export const ActivityCard = ({ activity }: Props) => {
  const { viewShotRef, openShareDialog } = useShare();

  return (
    <>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: "jpg",
          quality: 1,
          fileName: `Stats-va - Activity ${activity.id}`,
        }}
      >
        <View
          style={{
            backgroundColor: Theme.colors.white,
            padding: Theme.space.m,
            gap: Theme.space.m,
          }}
        >
          <ActivityHeader activity={activity} />
          <ActivitySecondaryStats activity={activity} />
          <ActivityMainStats activity={activity} />
          {activity.map && <Map polyline={activity.map.summary_polyline} />}

          <ShareBottom />
        </View>
      </ViewShot>

      <View
        style={{
          padding: Theme.space.m,
        }}
      >
        <Button onPress={openShareDialog}>Share</Button>
      </View>

      <View>
        <AdBanner adUnitId={AD_BANNER_ACTIVITY_UNIT_ID} />
      </View>
    </>
  );
};
