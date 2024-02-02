import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { View } from "react-native";
import { Activity } from "../../types";
import { Theme } from "../../theme";
import { Map } from "../../components/Map";
import { Button } from "../../components/layout/Button";
import { ActivityHeader } from "../../components/ActivityHeader";
import { ActivityMainStats } from "./ActivityMainStats";
import { ActivitySecondaryStats } from "./ActivitySecondaryStats";
import { ActivityStatsvaLogo } from "./ActivityStatsvaLogo";
import { ActivityProfile } from "./ActivityProfile";
import { useRef } from "react";

type Props = {
  activity: Activity;
};

export const ActivityCard = ({ activity }: Props) => {
  const viewShotRef = useRef<ViewShot>(null);

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Whoops! Sharing isn't available on your device!");
      return;
    }

    if (viewShotRef.current?.capture) {
      const uri = await viewShotRef.current.capture();

      const options = {
        mimeType: "image/jpeg",
        dialogTitle: "Share your stats",
        UTI: "image/jpeg",
      };

      await Sharing.shareAsync(uri, options);
    }
  };

  return (
    <View style={{ backgroundColor: Theme.colors.contrast }}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: "jpg",
          quality: 1,
        }}
      >
        <View
          style={{
            backgroundColor: Theme.colors.contrast,
            padding: Theme.space.m,
            gap: Theme.space.m,
          }}
        >
          <ActivityHeader activity={activity} />
          <ActivitySecondaryStats activity={activity} />
          <ActivityMainStats activity={activity} />
          {activity.map && <Map polyline={activity.map.summary_polyline} />}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ActivityStatsvaLogo />
            <ActivityProfile />
          </View>
        </View>
      </ViewShot>

      <View
        style={{
          padding: Theme.space.m,
        }}
      >
        <Button onPress={openShareDialog}>Share</Button>
      </View>
    </View>
  );
};
