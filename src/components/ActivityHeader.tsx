import { View } from "react-native";
import { SPORT_TYPE_TO_ICON, SPORT_TYPE_TO_LABEL } from "../constants";
import { Activity, SummaryActivity } from "../types";
import { Text } from "react-native-paper";
import moment from "moment";
import { Theme } from "../theme";

type Props = {
  activity: Activity | SummaryActivity;
};

export const ActivityHeader = ({ activity }: Props) => {
  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        gap: Theme.space.m,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: Theme.space.s,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: Theme.colors.gray,
          paddingBottom: Theme.space.s,
        }}
      >
        {SPORT_TYPE_TO_ICON[activity.sport_type]()}
        <View style={{ gap: 0 }}>
          <Text
            variant="labelLarge"
            style={{
              fontFamily: Theme.fonts.bold,
            }}
          >
            {SPORT_TYPE_TO_LABEL[activity.sport_type]}
          </Text>
          <Text
            variant="labelSmall"
            style={{
              fontFamily: Theme.fonts.bold,
            }}
          >
            {moment(activity.start_date).format("lll")}
          </Text>
        </View>
      </View>

      <Text
        variant="headlineSmall"
        style={{
          fontFamily: Theme.fonts.bold,
          lineHeight: 24,
        }}
      >
        {activity.name}
      </Text>
    </View>
  );
};
