import { View } from "react-native";
import * as React from "react";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Loading } from "../../components/layout/Loading";
import { Error } from "../../components/layout/Error";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { Theme } from "../../theme";
import { HomeStats } from "./HomeStats";
import { BuyMeACoffe } from "../../components/BuyMeACoffee";
import { HomeLastActivity } from "./HomeLastActivity";
import { useActivities } from "../../hooks/useActivities";
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_HOME_UNIT_ID } from "../../constants";

export const Home = () => {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStatus,
  } = useAthleteStats();

  const {
    data: activities,
    isLoading: isLoadingActivities,
    isError: isErrorActivies,
  } = useActivities({ page: 1, perPage: 1 });

  const isLoading = isLoadingStats || isLoadingActivities;
  const isError = isErrorStatus || isErrorActivies;

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
      {!isLoading && !isError && stats && activities && (
        <View style={{ gap: Theme.space.m }}>
          <HomeStats stats={stats} />
          <AdBanner adUnitId={AD_BANNER_HOME_UNIT_ID} />
          {activities[0] && <HomeLastActivity activity={activities[0]} />}
          <BuyMeACoffe />
        </View>
      )}
    </ScreenContainer>
  );
};
