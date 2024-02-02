import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { SportPicker } from "../../components/SportPicker";
import React from "react";
import { AthleteStats, Period, SportType, TitleAndContent } from "../../types";
import { PeriodSelector } from "../../components/PeriodSelector";
import {
  formatDistance,
  formatDistancePerHour,
  formatTime,
} from "../../helpers";
import { Button } from "../../components/Button";
import {
  PERIOD_TO_LABEL,
  SPORT_TYPE_TO_ICON,
  SPORT_TYPE_TO_LABEL,
} from "../../constants";
import { HomeStatsHeader } from "./HomeStatsHeader";
import { KeyValueList } from "../../components/KeyValueList";

export const SPORT_TYPE_BY_PERIOD_TO_TOTALS_VALUE = {
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
  const [sportSelected, setSportSelected] = React.useState<
    SportType.RIDE | SportType.RUN | SportType.SWIM
  >(SportType.RIDE);
  const [periodSelected, setPeriodSelected] = React.useState(
    Period.LAST_4_WEEKS
  );

  const { distance, moving_time, elevation_gain } =
    SPORT_TYPE_BY_PERIOD_TO_TOTALS_VALUE[sportSelected][periodSelected](stats);

  const keyValueList: TitleAndContent[] = [
    {
      title: "Distance",
      content: formatDistance(distance),
    },
    {
      title: "Moving time",
      content: formatTime(moving_time),
    },
    {
      title: "Pace",
      content: formatDistancePerHour(distance, moving_time),
    },
  ];

  if (sportSelected !== SportType.SWIM) {
    keyValueList.push({
      title: "Elevation",
      content: formatDistance(elevation_gain),
    });
  }

  if (sportSelected === SportType.RIDE && periodSelected === Period.ALL_TIME) {
    keyValueList.push({
      title: "Biggest distance",
      content: formatDistance(stats.biggest_ride_distance),
    });
  }

  return (
    <View
      style={{
        gap: Theme.space.l,
        backgroundColor: Theme.colors.contrast,
        padding: Theme.space.m,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text variant="titleLarge" style={{ fontFamily: Theme.fonts.bold }}>
          Stats for{" "}
        </Text>
        <SportPicker
          selectedValue={sportSelected}
          onSelection={setSportSelected}
        />
      </View>

      <PeriodSelector value={periodSelected} onChanges={setPeriodSelected} />

      <View
        style={{
          gap: Theme.space.s,
          backgroundColor: Theme.colors.contrast,
        }}
      >
        <HomeStatsHeader
          title={SPORT_TYPE_TO_LABEL[sportSelected]}
          subTitle={PERIOD_TO_LABEL[periodSelected]}
          renderIcon={SPORT_TYPE_TO_ICON[sportSelected]}
        />

        <KeyValueList data={keyValueList} />
      </View>

      <Button onPress={() => {}}>Share</Button>
    </View>
  );
};
