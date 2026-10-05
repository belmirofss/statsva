import React from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AthleteStats, Period, SportType, TitleAndContent } from "../../types";
import {
  formatDuration,
  formatElevation,
  formatKilometers,
  formatNumber,
  formatSpeedForSport,
  isSwim,
  speedLabelForSport,
} from "../../helpers";
import {
  PERIOD_TO_LABEL,
  PERIOD_TO_SHORT_LABEL,
  SPORT_TYPE_TO_ICON,
  SPORT_TYPE_TO_LABEL,
} from "../../constants";
import { Theme } from "../../theme";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SegmentedControl } from "../../components/SegmentedControl";
import { ChipGroup } from "../../components/ChipGroup";
import { StatGrid } from "../../components/StatGrid";
import { ShareSheet } from "../../components/share/ShareSheet";

type StatsSport = SportType.RIDE | SportType.RUN | SportType.SWIM;

const SPORTS: StatsSport[] = [SportType.RIDE, SportType.RUN, SportType.SWIM];
const PERIODS = [Period.LAST_4_WEEKS, Period.YEAR_TO_DATE, Period.ALL_TIME];

const SPORT_UNIT: { [key in StatsSport]: [string, string] } = {
  [SportType.RIDE]: ["ride", "rides"],
  [SportType.RUN]: ["run", "runs"],
  [SportType.SWIM]: ["swim", "swims"],
};

const TOTALS = {
  [SportType.RIDE]: {
    [Period.ALL_TIME]: (data: AthleteStats) => data.all_ride_totals,
    [Period.YEAR_TO_DATE]: (data: AthleteStats) => data.ytd_ride_totals,
    [Period.LAST_4_WEEKS]: (data: AthleteStats) => data.recent_ride_totals,
  },
  [SportType.RUN]: {
    [Period.ALL_TIME]: (data: AthleteStats) => data.all_run_totals,
    [Period.YEAR_TO_DATE]: (data: AthleteStats) => data.ytd_run_totals,
    [Period.LAST_4_WEEKS]: (data: AthleteStats) => data.recent_run_totals,
  },
  [SportType.SWIM]: {
    [Period.ALL_TIME]: (data: AthleteStats) => data.all_swim_totals,
    [Period.YEAR_TO_DATE]: (data: AthleteStats) => data.ytd_swim_totals,
    [Period.LAST_4_WEEKS]: (data: AthleteStats) => data.recent_swim_totals,
  },
};

type Props = {
  stats: AthleteStats;
};

export const HomeStats = ({ stats }: Props) => {
  const [sport, setSport] = React.useState<StatsSport>(SportType.RIDE);
  const [period, setPeriod] = React.useState(Period.LAST_4_WEEKS);
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  const totals = TOTALS[sport][period](stats);
  const averageSpeed = totals.moving_time
    ? totals.distance / totals.moving_time
    : undefined;
  const achievements = (totals as { achievement_count?: number })
    .achievement_count;

  const distance = formatKilometers(totals.distance) ?? "0";
  const [singular, plural] = SPORT_UNIT[sport];
  const countText = `${formatNumber(totals.count)} ${
    totals.count === 1 ? singular : plural
  }`;
  const countLine = `${countText} · ${PERIOD_TO_LABEL[period].toLowerCase()}`;

  const items: TitleAndContent[] = [
    { title: "Moving time", content: formatDuration(totals.moving_time) ?? "0m" },
    {
      title: speedLabelForSport(sport),
      content: formatSpeedForSport(sport, averageSpeed),
    },
    {
      title: "Elevation",
      content: isSwim(sport)
        ? undefined
        : formatElevation(totals.elevation_gain) ?? "0 m",
    },
    { title: "Elapsed time", content: formatDuration(totals.elapsed_time) },
    { title: "Activities", content: formatNumber(totals.count) },
    {
      title: "Achievements",
      content: achievements ? formatNumber(achievements) : undefined,
    },
  ];

  return (
    <>
      <Card
        style={{
          marginHorizontal: Theme.gutter,
          paddingHorizontal: Theme.gutter,
          paddingBottom: Theme.gutter,
          gap: Theme.space.m,
        }}
      >
        <SegmentedControl
          value={sport}
          onChange={setSport}
          trackColor={Theme.colors.background}
          options={SPORTS.map((value) => ({
            value,
            label: SPORT_TYPE_TO_LABEL[value],
            icon: SPORT_TYPE_TO_ICON[value],
          }))}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ChipGroup
            value={period}
            onChange={setPeriod}
            options={PERIODS.map((value) => ({
              value,
              label: PERIOD_TO_SHORT_LABEL[value],
            }))}
          />
          <Pressable
            onPress={() => setIsShareOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Share these stats"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: Theme.colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="export-variant"
              size={20}
              color={Theme.colors.text}
            />
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <View
            style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}
          >
            <AppText bold size={54} style={{ letterSpacing: -1.6 }}>
              {distance}
            </AppText>
            <AppText size={20} color={Theme.colors.textMuted}>
              km
            </AppText>
          </View>
          <AppText color={Theme.colors.textMuted}>{countLine}</AppText>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: Theme.colors.border,
            paddingTop: Theme.space.m,
          }}
        >
          <StatGrid items={items} />
        </View>
      </Card>

      <ShareSheet
        visible={isShareOpen}
        onDismiss={() => setIsShareOpen(false)}
        fileName="Stats-va - My Stats"
        content={{
          eyebrow: SPORT_TYPE_TO_LABEL[sport],
          eyebrowRight: PERIOD_TO_LABEL[period],
          hero: { value: distance, unit: "km", caption: countText },
          stats: items.filter(({ title }) => title !== "Activities"),
        }}
      />
    </>
  );
};
