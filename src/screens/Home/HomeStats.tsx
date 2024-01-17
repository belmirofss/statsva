import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";
import { SportPicker } from "../../components/SportPicker";
import React from "react";
import { AthleteStats, Period, SportType } from "../../types";
import { PeriodSelector } from "../../components/PeriodSelector";
import { HomeStatsSection } from "./HomeStatsSection";
import { HomeStatsSectionContent } from "./HomeStatsSectionContent";
import { formatTime, formatToKm, formatToM } from "../../helpers";
import { Button } from "../../components/Button";
import { BikingImg } from "../../components/BikingImg";
import { RunningImg } from "../../components/RunningImg";
import { SwimmingImg } from "../../components/SwimmingImg";

export const PERIOD_TO_LABEL = {
  [Period.ALL_TIME]: "All time",
  [Period.YEAR_TO_DATE]: "This year",
  [Period.LAST_4_WEEKS]: "Last 4 weeks",
};

export const SPORT_TYPE_TO_LABEL = {
  [SportType.RIDE]: "Ride",
  [SportType.RUN]: "Run",
  [SportType.SWIM]: "Swim",
};

export const SPORT_TYPE_TO_ICON = {
  [SportType.RIDE]: () => <BikingImg />,
  [SportType.RUN]: () => <RunningImg />,
  [SportType.SWIM]: () => <SwimmingImg />,
};

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

  return (
    <View style={{ display: "flex", gap: Theme.space.l }}>
      <View
        style={{
          display: "flex",
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
          value={formatToKm(
            SPORT_TYPE_BY_PERIOD_TO_TOTALS_VALUE[sportSelected][periodSelected](
              stats
            ).distance
          )}
        />

        {sportSelected === SportType.RIDE &&
          periodSelected === Period.ALL_TIME && (
            <HomeStatsSectionContent
              text="Biggest distance"
              value={formatToKm(stats.biggest_ride_distance)}
            />
          )}

        <HomeStatsSectionContent
          text="Moving time"
          value={formatTime(
            SPORT_TYPE_BY_PERIOD_TO_TOTALS_VALUE[sportSelected][periodSelected](
              stats
            ).moving_time
          )}
        />

        {sportSelected !== SportType.SWIM && (
          <HomeStatsSectionContent
            text="Elevation"
            value={formatToM(
              SPORT_TYPE_BY_PERIOD_TO_TOTALS_VALUE[sportSelected][
                periodSelected
              ](stats).elevation_gain
            )}
          />
        )}
      </HomeStatsSection>

      <Button onPress={() => {}}>Share</Button>
    </View>
  );
};
