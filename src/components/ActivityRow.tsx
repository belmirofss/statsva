import React from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SummaryActivity } from "../types";
import { Theme } from "../theme";
import { SPORT_TYPE_TO_LABEL } from "../constants";
import { formatActivityDate } from "../helpers";
import { summaryStats } from "../activityStats";
import { AppText } from "./layout/AppText";
import { RouteArt } from "./RouteArt";
import { SportIcon } from "./SportIcon";

const THUMB = 72;

type Props = {
  activity: SummaryActivity;
  onPress: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export const ActivityRow = React.memo(
  ({ activity, onPress, isFirst, isLast }: Props) => {
    const polyline = activity.map?.summary_polyline;

    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          marginHorizontal: Theme.gutter,
          paddingVertical: 12,
          paddingLeft: 12,
          paddingRight: 14,
          backgroundColor: pressed ? Theme.colors.background : Theme.colors.surface,
          borderTopWidth: isFirst ? 0 : 1,
          borderTopColor: Theme.colors.border,
          borderTopLeftRadius: isFirst ? Theme.radius.xl : 0,
          borderTopRightRadius: isFirst ? Theme.radius.xl : 0,
          borderBottomLeftRadius: isLast ? Theme.radius.xl : 0,
          borderBottomRightRadius: isLast ? Theme.radius.xl : 0,
        })}
      >
        {polyline ? (
          <View
            style={{
              width: THUMB,
              height: THUMB,
              borderRadius: Theme.radius.m,
              backgroundColor: Theme.colors.mapTint,
              overflow: "hidden",
            }}
          >
            <RouteArt
              polyline={polyline}
              width={THUMB}
              height={THUMB}
              color={Theme.colors.primary}
              strokeWidth={2.5}
              padding={10}
            />
          </View>
        ) : (
          <SportIcon sportType={activity.sport_type} size={THUMB} />
        )}

        <View style={{ flex: 1, gap: 4 }}>
          <AppText size={12} color={Theme.colors.textMuted} numberOfLines={1}>
            {SPORT_TYPE_TO_LABEL[activity.sport_type] ?? activity.sport_type} ·{" "}
            {formatActivityDate(activity.start_date_local)}
          </AppText>
          <AppText bold size={16} numberOfLines={1}>
            {activity.name}
          </AppText>
          <View style={{ flexDirection: "row", gap: 14 }}>
            {summaryStats(activity).map(({ label, value }) => (
              <View key={label}>
                <AppText size={11} color={Theme.colors.textMuted}>
                  {label}
                </AppText>
                <AppText size={13}>{value}</AppText>
              </View>
            ))}
          </View>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={Theme.colors.textMuted}
        />
      </Pressable>
    );
  }
);
