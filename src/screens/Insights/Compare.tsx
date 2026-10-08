import { useMemo, useState } from "react";
import { View } from "react-native";
import { Theme } from "../../theme";
import { formatDuration, formatNumber } from "../../helpers";
import { useActivityHistory } from "../../hooks/useActivityHistory";
import { DetailScreen } from "../../components/layout/DetailScreen";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SegmentedControl } from "../../components/SegmentedControl";
import { ChipGroup } from "../../components/ChipGroup";
import { LineChart } from "../../components/LineChart";
import { Legend } from "../../components/Legend";
import {
  ComparePeriod,
  comparePeriods,
  percentChange,
} from "../../insights/compare";
import {
  SPORT_FILTER_OPTIONS,
  SportFilter,
  mainSport,
  matchesSport,
} from "../../insights/sports";

const LAST_COLOR = "#9aa1ab";

const LABELS: {
  [key in ComparePeriod]: { this: string; last: string; noun: string };
} = {
  year: { this: "This year", last: "Last year", noun: "last year" },
  month: { this: "This month", last: "Last month", noun: "last month" },
  week: { this: "This week", last: "Last week", noun: "last week" },
};

const km = (meters: number) => formatNumber(meters / 1000, meters < 100000 ? 1 : 0);

export const Compare = () => {
  const history = useActivityHistory();
  const [period, setPeriod] = useState<ComparePeriod>("year");
  const [sport, setSport] = useState<SportFilter>();

  const activeSport = sport ?? (history.data ? mainSport(history.data) : "all");

  const comparison = useMemo(
    () =>
      history.data &&
      comparePeriods(
        history.data.filter((a) => matchesSport(activeSport, a)),
        period
      ),
    [history.data, activeSport, period]
  );

  const labels = LABELS[period];

  const content = comparison && (() => {
    const { thisTotals, lastToDate, lastFull, thisStart, lastStart, elapsed, thisLength } =
      comparison;
    const delta = thisTotals.distance - lastToDate.distance;
    const ahead = delta >= 0;
    const projected = elapsed + 1 < thisLength
      ? (thisTotals.distance / (elapsed + 1)) * thisLength
      : undefined;
    const now = thisStart.clone().add(elapsed, "days");
    const sameDay = lastStart.clone().add(Math.min(elapsed, comparison.lastLength - 1), "days");
    const dateFormat = period === "week" ? "dddd" : "D MMM";
    const lastName =
      period === "year" ? lastStart.format("YYYY") : period === "month" ? lastStart.format("MMMM") : "last week";
    const thisName =
      period === "year" ? thisStart.format("YYYY") : period === "month" ? thisStart.format("MMMM") : "this week";

    const rows = [
      {
        title: "Distance",
        current: `${km(thisTotals.distance)} km`,
        previous: `${km(lastToDate.distance)} km`,
        change: percentChange(thisTotals.distance, lastToDate.distance),
      },
      {
        title: "Time",
        current: formatDuration(thisTotals.movingTime) ?? "0m",
        previous: formatDuration(lastToDate.movingTime) ?? "0m",
        change: percentChange(thisTotals.movingTime, lastToDate.movingTime),
      },
      {
        title: "Elevation",
        current: `${formatNumber(thisTotals.elevation)} m`,
        previous: `${formatNumber(lastToDate.elevation)} m`,
        change: percentChange(thisTotals.elevation, lastToDate.elevation),
      },
      {
        title: "Activities",
        current: formatNumber(thisTotals.count),
        previous: formatNumber(lastToDate.count),
        change: percentChange(thisTotals.count, lastToDate.count),
      },
    ];

    const axis =
      period === "year"
        ? ["Jan", "Apr", "Jul", "Oct", "Dec"]
        : period === "month"
        ? ["1", "8", "15", "22", String(Math.max(thisLength, comparison.lastLength))]
        : ["Mon", "Wed", "Fri", "Sun"];

    return (
      <>
        <Card style={{ marginHorizontal: Theme.gutter, gap: 14 }}>
          <View style={{ gap: 6 }}>
            <AppText size={13} color={Theme.colors.textMuted}>
              {thisStart.format(dateFormat)} – {now.format(dateFormat)}
            </AppText>
            <AppText
              bold
              size={28}
              color={ahead ? Theme.colors.primaryDark : Theme.colors.text}
              style={{ letterSpacing: -0.5 }}
            >
              {ahead ? "+" : ""}
              {km(delta)} km {ahead ? "ahead" : "behind"}
            </AppText>
            <AppText color={Theme.colors.textMuted} style={{ lineHeight: 20 }}>
              {period === "week"
                ? `Last week you had ${km(lastToDate.distance)} km by ${sameDay.format("dddd")} and finished with ${km(lastFull.distance)} km.`
                : `On ${sameDay.format(period === "year" ? "D MMM YYYY" : "D MMM")} you had ${km(lastToDate.distance)} km. ${lastName} ended at ${km(lastFull.distance)} km.`}
              {projected && thisTotals.distance
                ? ` At this pace ${thisName} ends near ${km(projected)} km.`
                : ""}
            </AppText>
          </View>

          <View
            accessible
            accessibilityLabel={`Cumulative distance, ${labels.this.toLowerCase()} versus ${labels.noun}`}
          >
            <LineChart
              length={Math.max(thisLength, comparison.lastLength)}
              height={170}
              markerIndex={elapsed}
              series={[
                { data: comparison.lastCumulative.map((m) => m / 1000), color: LAST_COLOR, strokeWidth: 2 },
                {
                  data: comparison.thisCumulative.map((m) => m / 1000),
                  color: Theme.colors.primary,
                  strokeWidth: 3,
                  endDot: true,
                },
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: -6 }}>
            {axis.map((label) => (
              <AppText key={label} size={11} color={Theme.colors.textMuted}>
                {label}
              </AppText>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 18 }}>
            <Legend color={Theme.colors.primary} label={labels.this} />
            <Legend color={LAST_COLOR} label={labels.last} />
          </View>
        </Card>

        <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: Theme.space.xs }}>
          <View style={{ flexDirection: "row", paddingVertical: 10 }}>
            <AppText size={12} color={Theme.colors.textMuted} style={{ flex: 1.2 }}>
              Same point
            </AppText>
            <AppText size={12} color={Theme.colors.textMuted} style={{ flex: 1 }}>
              {labels.this}
            </AppText>
            <AppText size={12} color={Theme.colors.textMuted} style={{ flex: 1 }}>
              {labels.last}
            </AppText>
            <AppText size={12} color={Theme.colors.textMuted} style={{ width: 56, textAlign: "right" }}>
              Change
            </AppText>
          </View>
          {rows.map((row) => {
            const up = (row.change ?? 0) > 0;
            return (
              <View
                key={row.title}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  minHeight: 48,
                  borderTopWidth: 1,
                  borderTopColor: Theme.colors.border,
                }}
              >
                <AppText color={Theme.colors.textMuted} style={{ flex: 1.2 }}>
                  {row.title}
                </AppText>
                <AppText bold style={{ flex: 1 }} numberOfLines={1}>
                  {row.current}
                </AppText>
                <AppText style={{ flex: 1 }} numberOfLines={1}>
                  {row.previous}
                </AppText>
                <View style={{ width: 56, alignItems: "flex-end" }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 10,
                      backgroundColor: up ? Theme.colors.primaryLight : Theme.colors.control,
                    }}
                  >
                    <AppText bold size={12} color={up ? Theme.colors.primaryDark : Theme.colors.text}>
                      {row.change === undefined ? "–" : `${up ? "+" : ""}${row.change}%`}
                    </AppText>
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      </>
    );
  })();

  return (
    <DetailScreen
      title="This vs last"
      subtitle="Insights"
      isLoading={history.isLoading}
      isError={history.isError}
      onRefresh={history.refetch}
    >
      <View style={{ paddingHorizontal: Theme.gutter }}>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          options={[
            { value: "year", label: "Year" },
            { value: "month", label: "Month" },
            { value: "week", label: "Week" },
          ]}
        />
      </View>
      <ChipGroup
        scrollable
        variant="solid"
        value={activeSport}
        onChange={setSport}
        options={SPORT_FILTER_OPTIONS}
      />
      {content}
    </DetailScreen>
  );
};
