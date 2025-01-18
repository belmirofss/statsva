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
import { Button } from "../../components/layout/Button";
import {
  PERIOD_TO_LABEL,
  SPORT_TYPE_TO_ICON,
  SPORT_TYPE_TO_LABEL,
} from "../../constants";
import { HomeStatsHeader } from "./HomeStatsHeader";
import { KeyValueList } from "../../components/layout/KeyValueList";
import { ShareFooter } from "../../components/ShareFooter";
import { useShare } from "../../hooks/useShare";
import ViewShot from "react-native-view-shot";

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

  const { viewShotRef, openShareDialog } = useShare();

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
      title: "Speed",
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
        gap: Theme.space.m,
        borderWidth: 1,
        borderColor: Theme.colors.gray,
        borderRadius: Theme.roundness,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Theme.space.m,
          paddingTop: Theme.space.m,
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

      <View style={{ paddingHorizontal: Theme.space.m }}>
        <PeriodSelector value={periodSelected} onChanges={setPeriodSelected} />
      </View>

      <ViewShot
        ref={viewShotRef}
        options={{
          format: "jpg",
          quality: 1,
          fileName: `Stats-va - My Stats`,
        }}
      >
        <View
          style={{
            gap: Theme.space.s,
            backgroundColor: Theme.colors.white,
            padding: Theme.space.m,
          }}
        >
          <HomeStatsHeader
            title={SPORT_TYPE_TO_LABEL[sportSelected]}
            subTitle={PERIOD_TO_LABEL[periodSelected]}
            renderIcon={SPORT_TYPE_TO_ICON[sportSelected]}
          />

          <KeyValueList data={keyValueList} />
          <View style={{ marginTop: Theme.space.xs }}>
            <ShareFooter />
          </View>
        </View>
      </ViewShot>

      <View
        style={{
          paddingHorizontal: Theme.space.m,
          paddingBottom: Theme.space.m,
        }}
      >
        <Button onPress={openShareDialog}>Share</Button>
      </View>
    </View>
  );
};
