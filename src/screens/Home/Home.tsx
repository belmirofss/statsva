import { View } from "react-native";
import * as React from "react";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { Button } from "../../components/Button";
import { Theme } from "../../theme";
import { HomeStats } from "./HomeStats";

export const Home = () => {
  const { data: stats, isLoading, isError } = useAthleteStats();

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
      {!isLoading && !isError && stats && (
        <View style={{ display: "flex", gap: Theme.space.m }}>
          <HomeStats stats={stats} />
        </View>
      )}
    </ScreenContainer>
  );
};
