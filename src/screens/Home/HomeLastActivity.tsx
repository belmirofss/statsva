import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { SummaryActivity } from "../../types";
import { Map } from "../../components/Map";
import { Button } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { ActivityHeader } from "../../components/ActivityHeader";

type Props = {
  activity: SummaryActivity;
};

export const HomeLastActivity = ({ activity }: Props) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        gap: Theme.space.m,
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
      }}
    >
      <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
        Last activity
      </Text>

      <View style={{ gap: Theme.space.m }}>
        <ActivityHeader activity={activity} />
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
    </View>
  );
};
