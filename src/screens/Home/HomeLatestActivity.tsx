import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SummaryActivity } from "../../types";
import { Theme } from "../../theme";
import { SPORT_TYPE_TO_LABEL } from "../../constants";
import { formatActivityDate } from "../../helpers";
import { summaryStats } from "../../activityStats";
import { Map } from "../../components/Map";
import { AppText } from "../../components/layout/AppText";
import { SectionTitle } from "../../components/layout/SectionTitle";
import { SportIcon } from "../../components/SportIcon";

type Props = {
  activity: SummaryActivity;
};

export const HomeLatestActivity = ({ activity }: Props) => {
  const navigation = useNavigation();
  const polyline = activity.map?.summary_polyline;

  return (
    <View>
      <SectionTitle
        title="Latest activity"
        right={
          <Pressable
            onPress={() => navigation.navigate("Activities")}
            accessibilityRole="link"
            style={{
              minHeight: 44,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AppText bold color={Theme.colors.primaryDark}>
              See all
            </AppText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={Theme.colors.primaryDark}
            />
          </Pressable>
        }
      />
      <Pressable
        onPress={() => navigation.navigate("Activity", { id: activity.id })}
        accessibilityRole="button"
        style={{
          marginHorizontal: Theme.gutter,
          borderRadius: Theme.radius.xl,
          overflow: "hidden",
          backgroundColor: Theme.colors.surface,
        }}
      >
        {polyline && (
          <View pointerEvents="none">
            <Map polyline={polyline} height={150} />
          </View>
        )}
        <View style={{ padding: Theme.space.m, gap: Theme.space.s }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Theme.space.s,
            }}
          >
            <SportIcon sportType={activity.sport_type} />
            <AppText size={13} color={Theme.colors.textMuted}>
              {SPORT_TYPE_TO_LABEL[activity.sport_type] ?? activity.sport_type}{" "}
              · {formatActivityDate(activity.start_date_local)}
            </AppText>
          </View>
          <AppText bold size={18}>
            {activity.name}
          </AppText>
          <View style={{ flexDirection: "row", gap: 18 }}>
            {summaryStats(activity).map((value) => (
              <AppText key={value} bold size={15}>
                {value}
              </AppText>
            ))}
          </View>
        </View>
      </Pressable>
    </View>
  );
};
