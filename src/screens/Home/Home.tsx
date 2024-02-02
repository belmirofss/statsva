import { View } from "react-native";
import * as React from "react";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { Button } from "../../components/Button";
import { Theme } from "../../theme";
import { HomeStats } from "./HomeStats";
import { BuyMeACoffe } from "../../components/BuyMeACoffee";
import { HomeLastActivity } from "./HomeLastActivity";
import { useActivities } from "../../hooks/useActivities";

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
        <View style={{ gap: Theme.space.l }}>
          <HomeStats stats={stats} />
          <BuyMeACoffe />
          {activities[0] && <HomeLastActivity activity={activities[0]} />}
        </View>
      )}
    </ScreenContainer>
  );
};
