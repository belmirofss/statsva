import { View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { Button } from "../../components/Button";
import { BikingImg } from "../../components/BikingImg";
import { RunningImg } from "../../components/RunningImg";
import { SwimmingImg } from "../../components/SwimmingImg";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";

const Box = ({ title, content }: { title: string; content: string }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: Theme.colors.placeholder,
        borderBottomWidth: 1,
        paddingBottom: Theme.space.xs,
      }}
    >
      <Text variant="bodyMedium" style={{ fontFamily: Theme.fonts.bold }}>
        {title}
      </Text>
      <Text
        variant="titleLarge"
        style={{ color: Theme.colors.primary, fontFamily: Theme.fonts.bold }}
      >
        {content}
      </Text>
    </View>
  );
};

export const Home = () => {
  const { data, isLoading, isError } = useAthleteStats();

  const sections = [
    {
      title: "Ride",
      renderImg: () => <BikingImg />,
      renderContent: () => {
        const total = data?.all_ride_totals.distance || 0;
        const ytd = data?.ytd_ride_totals.distance || 0;
        const recent = data?.recent_ride_totals.distance || 0;

        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Theme.space.s,
            }}
          >
            <Box
              title="All time"
              content={(total / 1000).toFixed(1).concat(" km")}
            />
            <Box
              title="This year"
              content={(ytd / 1000).toFixed(1).concat(" km")}
            />
            <Box
              title="Last 4 weeks"
              content={(recent / 1000).toFixed(1).concat(" km")}
            />
          </View>
        );
      },
    },
    {
      title: "Run",
      renderImg: () => <RunningImg />,
      renderContent: () => {
        const total = data?.all_run_totals.distance || 0;
        const ytd = data?.ytd_run_totals.distance || 0;
        const recent = data?.recent_run_totals.distance || 0;

        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Theme.space.s,
            }}
          >
            <Box
              title="All time"
              content={(total / 1000).toFixed(1).concat(" km")}
            />
            <Box
              title="This year"
              content={(ytd / 1000).toFixed(1).concat(" km")}
            />
            <Box
              title="Last 4 weeks"
              content={(recent / 1000).toFixed(1).concat(" km")}
            />
          </View>
        );
      },
    },
    {
      title: "Swim",
      renderImg: () => <SwimmingImg />,
      renderContent: () => {
        const total = data?.all_swim_totals.distance || 0;
        const ytd = data?.ytd_swim_totals.distance || 0;
        const recent = data?.recent_swim_totals.distance || 0;

        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Theme.space.s,
            }}
          >
            <Box
              title="All time"
              content={(total / 1000).toFixed(1).concat(" km")}
            />
            <Box
              title="This year"
              content={(ytd / 1000).toFixed(1).concat(" km")}
            />
            <Box
              title="Last 4 weeks"
              content={(recent / 1000).toFixed(1).concat(" km")}
            />
          </View>
        );
      },
    },
  ];

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
      {!isLoading && !isError && data && (
        <View style={{ display: "flex", gap: Theme.space.m }}>
          <Button onPress={() => {}}>Share</Button>

          <View style={{ display: "flex", gap: Theme.space.l }}>
            {sections.map(({ title, renderImg, renderContent }) => (
              <View key={title}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderLeftColor: Theme.colors.primary,
                    borderLeftWidth: 4,
                    borderRightColor: Theme.colors.primary,
                    borderRightWidth: 4,
                    paddingHorizontal: Theme.space.s,
                  }}
                >
                  <Text
                    variant="titleMedium"
                    style={{
                      fontFamily: Theme.fonts.bold,
                    }}
                  >
                    {title}
                  </Text>
                  {renderImg()}
                </View>
                <View
                  style={{
                    marginTop: Theme.space.s,
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderContent()}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
