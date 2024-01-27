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

export const Home = () => {
  const { data: stats, isLoading, isError } = useAthleteStats();

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
      {!isLoading && !isError && stats && (
        <View style={{ gap: Theme.space.l }}>
          <HomeStats stats={stats} />
          <BuyMeACoffe />
        </View>
      )}
    </ScreenContainer>
  );
};
