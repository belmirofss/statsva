import { useState } from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Activity } from "../../types";
import { Theme } from "../../theme";
import {
  formatDistance,
  formatSpeedForSport,
  formatTime,
  usesPace,
} from "../../helpers";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SectionTitle } from "../../components/layout/SectionTitle";

const SEGMENTS_PREVIEW = 5;

const rankLabel = (rank: number | null | undefined, best = "PR") => {
  if (rank === 1) return best;
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return undefined;
};

type RowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  divided: boolean;
  onPress?: () => void;
};

const EffortRow = ({ title, subtitle, value, badge, divided, onPress }: RowProps) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? "button" : undefined}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: Theme.space.m,
      minHeight: 60,
      paddingVertical: Theme.space.s,
      borderTopWidth: divided ? 1 : 0,
      borderTopColor: Theme.colors.border,
    }}
  >
    {badge !== undefined && (
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: badge ? Theme.colors.primaryLight : Theme.colors.background,
        }}
      >
        <AppText bold size={11} color={Theme.colors.primaryDark}>
          {badge}
        </AppText>
      </View>
    )}
    <View style={{ flex: 1, gap: 2 }}>
      <AppText bold numberOfLines={2}>
        {title}
      </AppText>
      {subtitle && (
        <AppText size={12} color={Theme.colors.textMuted}>
          {subtitle}
        </AppText>
      )}
    </View>
    {value && (
      <AppText bold size={16}>
        {value}
      </AppText>
    )}
    {onPress && (
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={Theme.colors.textMuted}
        style={{ marginLeft: -8 }}
      />
    )}
  </Pressable>
);

type Props = {
  activity: Activity;
};

/** Per-km splits, only meaningful for pace sports. */
export const ActivitySplits = ({ activity }: Props) => {
  const splits = activity.splits_metric ?? [];
  if (!usesPace(activity.sport_type) || splits.length < 2) {
    return null;
  }

  const fastest = Math.max(...splits.map((split) => split.average_speed));

  return (
    <View>
      <SectionTitle title="Splits" inset={false} />
      <Card style={{ gap: Theme.space.s }}>
        {splits.map((split) => {
          const label =
            split.distance < 950
              ? (split.distance / 1000).toFixed(1)
              : String(split.split);
          const elevation = split.elevation_difference ?? 0;

          return (
            <View
              key={split.split}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <AppText
                size={13}
                color={Theme.colors.textMuted}
                style={{ width: 28 }}
              >
                {label}
              </AppText>
              <View style={{ flex: 1, height: 20, justifyContent: "center" }}>
                <View
                  style={{
                    height: 20,
                    borderRadius: 6,
                    width: `${Math.max(
                      8,
                      (split.average_speed / fastest) * 100
                    )}%`,
                    backgroundColor:
                      split.average_speed === fastest
                        ? Theme.colors.primary
                        : Theme.colors.primaryMuted,
                  }}
                />
              </View>
              <AppText bold size={13} style={{ width: 76, textAlign: "right" }}>
                {formatSpeedForSport(activity.sport_type, split.average_speed)}
              </AppText>
              <AppText
                size={12}
                color={Theme.colors.textMuted}
                style={{ width: 44, textAlign: "right" }}
              >
                {elevation > 0 ? "+" : ""}
                {Math.round(elevation)} m
              </AppText>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

export const ActivityBestEfforts = ({ activity }: Props) => {
  const efforts = activity.best_efforts ?? [];
  if (!efforts.length) {
    return null;
  }

  return (
    <View>
      <SectionTitle title="Best efforts" inset={false} />
      <Card style={{ paddingVertical: Theme.space.xs }}>
        {efforts.map((effort, index) => (
          <EffortRow
            key={effort.id}
            title={effort.name}
            value={formatTime(effort.elapsed_time)}
            badge={rankLabel(effort.pr_rank) ?? ""}
            divided={index > 0}
          />
        ))}
      </Card>
    </View>
  );
};

export const ActivityLaps = ({ activity }: Props) => {
  const laps = activity.laps ?? [];
  if (laps.length < 2) {
    return null;
  }

  return (
    <View>
      <SectionTitle title="Laps" inset={false} />
      <Card style={{ paddingVertical: Theme.space.xs }}>
        {laps.map((lap, index) => (
          <EffortRow
            key={lap.id}
            title={lap.name || `Lap ${lap.lap_index}`}
            subtitle={[
              formatDistance(lap.distance),
              formatSpeedForSport(activity.sport_type, lap.average_speed),
            ]
              .filter(Boolean)
              .join(" · ")}
            value={formatTime(lap.moving_time)}
            divided={index > 0}
          />
        ))}
      </Card>
    </View>
  );
};

export const ActivitySegments = ({ activity }: Props) => {
  const navigation = useNavigation();
  const [showAll, setShowAll] = useState(false);
  const efforts = activity.segment_efforts ?? [];
  if (!efforts.length) {
    return null;
  }

  const visible = showAll ? efforts : efforts.slice(0, SEGMENTS_PREVIEW);

  return (
    <View>
      <SectionTitle title="Segments" inset={false} />
      <Card style={{ paddingVertical: Theme.space.xs }}>
        {visible.map((effort, index) => (
          <EffortRow
            key={effort.id}
            title={effort.name}
            subtitle={[
              formatDistance(effort.segment?.distance),
              effort.segment ? `${effort.segment.average_grade.toFixed(1)}%` : undefined,
            ]
              .filter(Boolean)
              .join(" · ")}
            value={formatTime(effort.elapsed_time)}
            badge={
              (effort.kom_rank ? rankLabel(effort.kom_rank, "KOM") : undefined) ??
              rankLabel(effort.pr_rank) ??
              ""
            }
            divided={index > 0}
            onPress={
              effort.segment
                ? () =>
                    navigation.navigate("Segment", {
                      id: effort.segment.id,
                      name: effort.segment.name,
                    })
                : undefined
            }
          />
        ))}
        {efforts.length > SEGMENTS_PREVIEW && (
          <Pressable
            onPress={() => setShowAll((current) => !current)}
            accessibilityRole="button"
            style={{
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
              borderTopWidth: 1,
              borderTopColor: Theme.colors.border,
            }}
          >
            <AppText bold color={Theme.colors.primaryDark}>
              {showAll ? "Show fewer" : `Show all ${efforts.length} segments`}
            </AppText>
          </Pressable>
        )}
      </Card>
    </View>
  );
};
