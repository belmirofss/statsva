import { Error } from "../components/Error";
import { Loading } from "../components/Loading";
import { ScreenContainer } from "../components/ScreenContainer";
import { useActivity } from "../hooks/useActivity";
import { RouteProp, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { SPORT_TYPE_TO_ICON, SPORT_TYPE_TO_LABEL } from "../constants";
import moment from "moment";
import { Theme } from "../theme";
import { Text } from "react-native-paper";
import { Map } from "../components/Map";
import { Chip } from "../components/Chip";
import { TitleAndContent } from "../types";
import {
  formatCalories,
  formatDistance,
  formatHeartrate,
  formatSpeed,
  formatTime,
} from "../helpers";
import { KeyValueList } from "../components/KeyValueList";
import { Button } from "../components/Button";

type Params = {
  Activity: {
    id: number;
  };
};

export const Activity = () => {
  const { params } = useRoute<RouteProp<Params, "Activity">>();
  const { data: activity, isLoading, isError } = useActivity({ id: params.id });

  const keyValueList: TitleAndContent[] = activity
    ? [
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
      ].filter(({ content }) => !!content)
    : [];

  return (
    <ScreenContainer>
      {isError && <Error />}
      {isLoading && <Loading />}
      {activity && (
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
            <View
              style={{
                flexDirection: "row",
                gap: Theme.space.s,
                alignItems: "center",
              }}
            >
              {SPORT_TYPE_TO_ICON[activity.sport_type]()}
              <View>
                <Text
                  variant="labelSmall"
                  style={{
                    fontFamily: Theme.fonts.bold,
                    marginBottom: -Theme.space.s, // Removes margin from Text
                  }}
                >
                  {moment(activity.start_date).format("lll")}
                </Text>
                <Text
                  variant="headlineLarge"
                  style={{
                    fontFamily: Theme.fonts.bold,
                  }}
                >
                  {activity.name}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: Theme.space.s }}>
              <Chip
                title="Type"
                content={SPORT_TYPE_TO_LABEL[activity.sport_type]}
              />
              <Chip
                title="Calories"
                content={formatCalories(activity.kilojoules)}
              />
              <Chip
                title="Heartrate"
                content={formatHeartrate(activity.average_heartrate)}
              />
            </View>

            <KeyValueList data={keyValueList} />

            {activity.map && <Map polyline={activity.map.summary_polyline} />}
          </View>

          <Button onPress={() => {}}>Share</Button>
        </View>
      )}
    </ScreenContainer>
  );
};
