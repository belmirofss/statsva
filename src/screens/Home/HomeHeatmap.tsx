import { useMemo } from "react";
import { View } from "react-native";
import moment from "moment";
import { SummaryActivity } from "../../types";
import { Theme } from "../../theme";
import { RECENT_WEEKS } from "../../constants";
import { formatDuration } from "../../helpers";
import { recentWeeksStart } from "../../hooks/useRecentActivities";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";

const LEVEL_COLORS = [
  "#eceef1",
  Theme.colors.primaryMuted,
  "#fd8a57",
  Theme.colors.primary,
];
const DAY_LABELS = ["M", "", "W", "", "F", "", "S"];
const GAP = 4;
const LABEL_WIDTH = 12;

type Day = {
  key: string;
  level: number;
  isFuture: boolean;
  isToday: boolean;
};

type Props = {
  activities: SummaryActivity[];
};

/** Moving time per day over the last 12 weeks, one column per week. */
export const HomeHeatmap = ({ activities }: Props) => {
  const { weeks, totalTime, activeDays } = useMemo(() => {
    const secondsByDay = new Map<string, number>();
    activities.forEach((activity) => {
      const key = activity.start_date_local.slice(0, 10);
      secondsByDay.set(key, (secondsByDay.get(key) ?? 0) + activity.moving_time);
    });

    const max = Math.max(0, ...secondsByDay.values());
    const today = moment().format("YYYY-MM-DD");
    const start = recentWeeksStart();

    const weeks = Array.from({ length: RECENT_WEEKS }, (_, weekIndex) => {
      const weekStart = start.clone().add(weekIndex, "weeks");
      const days: Day[] = Array.from({ length: 7 }, (_, dayIndex) => {
        const key = weekStart.clone().add(dayIndex, "days").format("YYYY-MM-DD");
        const seconds = secondsByDay.get(key) ?? 0;
        const level = !seconds
          ? 0
          : seconds <= max / 3
          ? 1
          : seconds <= (max * 2) / 3
          ? 2
          : 3;
        return { key, level, isFuture: key > today, isToday: key === today };
      });

      const firstOfMonth = days.find((day) => day.key.endsWith("-01"));
      const month =
        weekIndex === 0
          ? weekStart.format("MMM")
          : firstOfMonth
          ? moment(firstOfMonth.key).format("MMM")
          : "";

      return { key: weekStart.format("YYYY-MM-DD"), month, days };
    });

    return {
      weeks,
      totalTime: activities.reduce((sum, a) => sum + a.moving_time, 0),
      activeDays: secondsByDay.size,
    };
  }, [activities]);

  const summary = `${activities.length} ${
    activities.length === 1 ? "activity" : "activities"
  } · ${formatDuration(totalTime) ?? "0m"}`;

  return (
    <Card
      style={{ marginHorizontal: Theme.gutter, gap: Theme.space.m }}
      accessible
      accessibilityLabel={`Last ${RECENT_WEEKS} weeks: ${summary}, ${activeDays} active days`}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <AppText bold size={16}>
          Last {RECENT_WEEKS} weeks
        </AppText>
        <AppText size={13} color={Theme.colors.textMuted}>
          {summary}
        </AppText>
      </View>

      <View style={{ gap: GAP }}>
        <View style={{ flexDirection: "row", gap: GAP }}>
          <View style={{ width: LABEL_WIDTH }} />
          {weeks.map((week) => (
            <View key={week.key} style={{ flex: 1 }}>
              <AppText
                size={10}
                color={Theme.colors.textMuted}
                numberOfLines={1}
                style={{ width: 32 }}
              >
                {week.month}
              </AppText>
            </View>
          ))}
        </View>
        {DAY_LABELS.map((label, dayIndex) => (
          <View
            key={dayIndex}
            style={{ flexDirection: "row", alignItems: "center", gap: GAP }}
          >
            <AppText
              size={9}
              color={Theme.colors.textMuted}
              style={{ width: LABEL_WIDTH }}
            >
              {label}
            </AppText>
            {weeks.map((week) => {
              const day = week.days[dayIndex];
              return (
                <View
                  key={day.key}
                  style={{
                    flex: 1,
                    aspectRatio: 1,
                    borderRadius: 4,
                    backgroundColor: day.isFuture
                      ? "transparent"
                      : LEVEL_COLORS[day.level],
                    borderWidth: day.isToday ? 2 : day.isFuture ? 1 : 0,
                    borderColor: day.isToday
                      ? Theme.colors.text
                      : Theme.colors.border,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText size={12} color={Theme.colors.textMuted}>
          {activeDays} active {activeDays === 1 ? "day" : "days"}
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AppText size={11} color={Theme.colors.textMuted}>
            Less
          </AppText>
          {LEVEL_COLORS.map((color) => (
            <View
              key={color}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: color,
              }}
            />
          ))}
          <AppText size={11} color={Theme.colors.textMuted}>
            More
          </AppText>
        </View>
      </View>
    </Card>
  );
};
