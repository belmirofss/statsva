import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { formatNumber } from "../../helpers";
import { historyStart, useActivityHistory } from "../../hooks/useActivityHistory";
import { DetailScreen } from "../../components/layout/DetailScreen";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SegmentedControl } from "../../components/SegmentedControl";
import {
  StreakMode,
  computeStreak,
  dayLevel,
  secondsByDay,
} from "../../insights/streaks";
import { DAY_FORMAT, today } from "../../insights/dates";

const LEVEL_COLORS = ["#eceef1", Theme.colors.primaryMuted, "#fd8a57", Theme.colors.primary];

const plural = (count: number, mode: StreakMode) =>
  `${count === 1 ? (mode === "weekly" ? "week" : "day") : mode === "weekly" ? "weeks" : "days"}`;

export const Streaks = () => {
  const history = useActivityHistory();
  const [mode, setMode] = useState<StreakMode>("weekly");
  const [year, setYear] = useState(moment().year());
  const firstYear = historyStart().year();

  const streak = useMemo(
    () => history.data && computeStreak(history.data, mode, historyStart()),
    [history.data, mode]
  );

  const calendar = useMemo(() => {
    const seconds = secondsByDay(history.data ?? []);
    const max = Math.max(0, ...seconds.values());
    const now = today();
    let activeDays = 0;
    let elapsedDays = 0;

    const months = Array.from({ length: 12 }, (_, month) => {
      const first = moment.utc({ year, month, day: 1 });
      const offset = first.isoWeekday() - 1;
      const cells = Array.from({ length: offset }, () => ({ key: "", color: "transparent", border: false, isToday: false }));
      for (let day = 1; day <= first.daysInMonth(); day++) {
        const date = first.clone().date(day);
        const key = date.format(DAY_FORMAT);
        const future = date.isAfter(now);
        const value = seconds.get(key) ?? 0;
        if (!future) {
          elapsedDays++;
          if (value) activeDays++;
        }
        cells.push({
          key,
          color: future ? "transparent" : LEVEL_COLORS[dayLevel(value, max)],
          border: future,
          isToday: date.isSame(now, "day"),
        });
      }
      return { name: first.format("MMM"), cells };
    });

    return { months, activeDays, elapsedDays };
  }, [history.data, year]);

  const unitLabel = (count: number) => `${count} ${plural(count, mode)}`;
  const sinceText = streak?.since
    ? mode === "weekly"
      ? `At least one activity every week since ${streak.since.format("D MMM")}.`
      : `Active every day since ${streak.since.format("D MMM")}.`
    : "";
  const pendingText = streak?.current
    ? streak.pending
      ? mode === "weekly"
        ? ` Get out by Sunday to make it ${streak.current + 1}.`
        : " Get out today to keep it going."
      : ""
    : mode === "weekly"
    ? "Log an activity this week to start a streak."
    : "Log an activity today to start a streak.";

  return (
    <DetailScreen
      title="Streaks"
      subtitle="Insights"
      isLoading={history.isLoading}
      isError={history.isError}
      onRefresh={history.refetch}
    >
      {streak && (
        <>
          <View style={{ paddingHorizontal: Theme.gutter }}>
            <SegmentedControl
              value={mode}
              onChange={setMode}
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "daily", label: "Daily" },
              ]}
            />
          </View>

          <Card
            style={{
              marginHorizontal: Theme.gutter,
              backgroundColor: Theme.colors.primary,
              padding: Theme.gutter,
              gap: Theme.space.m,
              overflow: "hidden",
            }}
            accessible
            accessibilityLabel={`Current streak ${unitLabel(streak.current)}. ${sinceText}${pendingText}`}
          >
            <MaterialCommunityIcons
              name="fire"
              size={150}
              color="rgba(255,255,255,0.2)"
              style={{ position: "absolute", right: -24, top: -16 }}
            />
            <AppText bold size={13} color={Theme.colors.white} style={{ letterSpacing: 1 }}>
              CURRENT STREAK
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <AppText bold size={64} color={Theme.colors.white} style={{ letterSpacing: -2, lineHeight: 68 }}>
                {streak.current}
              </AppText>
              <AppText bold size={22} color={Theme.colors.white}>
                {plural(streak.current, mode)}
              </AppText>
            </View>
            <AppText color={Theme.colors.white} style={{ lineHeight: 20 }}>
              {sinceText}
              {pendingText}
            </AppText>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {streak.chain.map((active, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    height: 18,
                    borderRadius: 5,
                    backgroundColor: active ? Theme.colors.white : "rgba(255,255,255,0.3)",
                    borderWidth: index === streak.chain.length - 1 ? 2 : 0,
                    borderColor: Theme.colors.text,
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText size={11} color={Theme.colors.white}>
                {mode === "weekly" ? "16 weeks ago" : "16 days ago"}
              </AppText>
              <AppText size={11} color={Theme.colors.white}>
                {mode === "weekly" ? "This week" : "Today"}
              </AppText>
            </View>
          </Card>

          <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: Theme.gutter }}>
            <Card style={{ flex: 1, gap: 4 }}>
              <AppText size={12} color={Theme.colors.textMuted}>
                Longest since {firstYear}
              </AppText>
              <AppText bold size={22}>
                {unitLabel(streak.longest)}
              </AppText>
              {streak.longestStart && streak.longestEnd && (
                <AppText size={12} color={Theme.colors.textMuted}>
                  {streak.longestStart.format("D MMM YY")} – {streak.longestEnd.format("D MMM YY")}
                </AppText>
              )}
            </Card>
            <Card style={{ flex: 1, gap: 4 }}>
              <AppText size={12} color={Theme.colors.textMuted}>
                Active days in {year}
              </AppText>
              <AppText bold size={22}>
                {formatNumber(calendar.activeDays)}
              </AppText>
              <AppText size={12} color={Theme.colors.textMuted}>
                of {formatNumber(calendar.elapsedDays)} so far
              </AppText>
            </Card>
          </View>

          <Card style={{ marginHorizontal: Theme.gutter, gap: Theme.space.m }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <YearArrow
                direction="left"
                disabled={year <= firstYear}
                onPress={() => setYear((y) => y - 1)}
              />
              <AppText bold size={16} accessibilityRole="header">
                {year}
              </AppText>
              <YearArrow
                direction="right"
                disabled={year >= moment().year()}
                onPress={() => setYear((y) => y + 1)}
              />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 14, columnGap: 14 }}>
              {calendar.months.map((month) => (
                <View key={month.name} style={{ width: "29.5%", flexGrow: 1, gap: 6 }}>
                  <AppText bold size={12}>
                    {month.name}
                  </AppText>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {month.cells.map((cell, index) => (
                      <View key={cell.key || `blank-${index}`} style={{ width: `${100 / 7}%`, padding: 1 }}>
                        <View
                          style={{
                            aspectRatio: 1,
                            borderRadius: 3,
                            backgroundColor: cell.color,
                            borderWidth: cell.isToday ? 2 : cell.border ? 1 : 0,
                            borderColor: cell.isToday ? Theme.colors.text : Theme.colors.border,
                          }}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
              <AppText size={11} color={Theme.colors.textMuted}>
                Less
              </AppText>
              {LEVEL_COLORS.map((color) => (
                <View key={color} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color }} />
              ))}
              <AppText size={11} color={Theme.colors.textMuted}>
                More
              </AppText>
            </View>
          </Card>
        </>
      )}
    </DetailScreen>
  );
};

type YearArrowProps = {
  direction: "left" | "right";
  disabled: boolean;
  onPress: () => void;
};

const YearArrow = ({ direction, disabled, onPress }: YearArrowProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={direction === "left" ? "Previous year" : "Next year"}
    accessibilityState={{ disabled }}
    style={{
      width: 44,
      height: 44,
      margin: -10,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <MaterialCommunityIcons
      name={direction === "left" ? "chevron-left" : "chevron-right"}
      size={24}
      color={disabled ? Theme.colors.gray : Theme.colors.text}
    />
  </Pressable>
);
