import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { SummaryActivity } from "../../types";
import { Map } from "../../components/Map";
import { Button } from "../../components/layout/Button";
import { useNavigation } from "@react-navigation/native";
import { ActivityHeader } from "../../components/ActivityHeader";
import { SummarizedActivityStats } from "../../components/SummarizedActivityStats";

type Props = {
  activity: SummaryActivity;
};

export const HomeLastActivity = ({ activity }: Props) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        gap: Theme.space.m,
        padding: Theme.space.m,
        borderRadius: Theme.roundness,
        backgroundColor: Theme.colors.white,
      }}
    >
      <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
        Last activity
      </Text>

      <View style={{ gap: Theme.space.m }}>
        <ActivityHeader activity={activity} />
        <SummarizedActivityStats activity={activity} />
        {activity.map?.summary_polyline && (
          <Map polyline={activity.map.summary_polyline} />
        )}
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate("Activity", { id: activity.id });
          }}
        >
          View more
        </Button>
      </View>
    </View>
  );
};
