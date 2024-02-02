import React from "react";
import { View } from "react-native";
import { SummaryActivity } from "../../types";
import { Theme } from "../../theme";
import { Map } from "../../components/Map";
import { Button } from "../../components/layout/Button";
import { useNavigation } from "@react-navigation/native";
import { ActivityHeader } from "../../components/ActivityHeader";
import { SummarizedActivityStats } from "../../components/SummarizedActivityStats";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = React.memo(({ activity }: Props) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
        gap: Theme.space.s,
      }}
    >
      <ActivityHeader activity={activity} />

      <SummarizedActivityStats activity={activity} />
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
