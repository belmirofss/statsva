import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { SportPicker } from "../../components/SportPicker";
import React from "react";
import { AthleteStats, Period, SportType } from "../../types";
import { PeriodSelector } from "../../components/PeriodSelector";
import { HomeStatsSection } from "./HomeStatsSection";
import { HomeStatsSectionContent } from "./HomeStatsSectionContent";
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

  return (
    <View style={{ gap: Theme.space.l }}>
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

      <HomeStatsSection
        title={SPORT_TYPE_TO_LABEL[sportSelected]}
        subTitle={PERIOD_TO_LABEL[periodSelected]}
        renderIcon={SPORT_TYPE_TO_ICON[sportSelected]}
      >
        <HomeStatsSectionContent
          text="Distance"
          value={formatDistance(distance) || "-"}
        />

        <HomeStatsSectionContent
          text="Moving time"
          value={formatTime(moving_time) || "-"}
        />

        <HomeStatsSectionContent
          text="Pace"
          value={formatDistancePerHour(distance, moving_time) || "-"}
        />

        {sportSelected !== SportType.SWIM && (
          <HomeStatsSectionContent
            text="Elevation"
            value={formatDistance(elevation_gain) || "-"}
          />
        )}

        {sportSelected === SportType.RIDE &&
          periodSelected === Period.ALL_TIME && (
            <HomeStatsSectionContent
              text="Biggest distance"
              value={formatDistance(stats.biggest_ride_distance) || "-"}
            />
          )}
      </HomeStatsSection>

      <Button onPress={() => {}}>Share</Button>
    </View>
  );
};
