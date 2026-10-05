import * as React from "react";
import { Animated, RefreshControl, View } from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loading } from "../../components/layout/Loading";
import { Error } from "../../components/layout/Error";
import {
  CompactHeader,
  LargeHeader,
  useCollapsingHeader,
} from "../../components/layout/ScreenHeader";
import { Avatar } from "../../components/Avatar";
import { AdBanner } from "../../components/AdBanner";
import { BuyMeACoffe } from "../../components/BuyMeACoffee";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { useRecentActivities } from "../../hooks/useRecentActivities";
import { useLatestActivity } from "../../hooks/useLatestActivity";
import { useAppContext } from "../../hooks/useAppContext";
import { AD_BANNER_HOME_UNIT_ID } from "../../constants";
import { Theme } from "../../theme";
import { HomeStats } from "./HomeStats";
import { HomeLatestActivity } from "./HomeLatestActivity";
import { HomeHeatmap } from "./HomeHeatmap";
import { HomeBests } from "./HomeBests";

export const Home = () => {
  const { me } = useAppContext();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useCollapsingHeader();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const stats = useAthleteStats();
  const recent = useRecentActivities();
  const latestFallback = useLatestActivity({
    enabled: recent.isSuccess && !recent.data.length,
  });

  const latest = recent.data?.[0] ?? latestFallback.data;
  const isLoading = stats.isLoading || recent.isLoading;
  const isError = stats.isError || recent.isError;

  const refresh = async () => {
    setIsRefreshing(true);
    await Promise.all([stats.refetch(), recent.refetch()]);
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          gap: Theme.space.m,
          paddingBottom: Theme.space.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[Theme.colors.primary]}
            tintColor={Theme.colors.primary}
            progressViewOffset={insets.top}
          />
        }
      >
        <LargeHeader
          subtitle={moment().format("dddd, D MMMM")}
          title={me?.firstname ? `Hi, ${me.firstname}` : "Hi there"}
          right={
            <Avatar
              athlete={me}
              onPress={() => navigation.navigate("Account")}
            />
          }
        />

        {isLoading && <Loading mode="local" />}
        {isError && <Error />}

        {stats.data && <HomeStats stats={stats.data} />}
        {!isLoading && <AdBanner adUnitId={AD_BANNER_HOME_UNIT_ID} />}
        {latest && <HomeLatestActivity activity={latest} />}
        {recent.data && <HomeHeatmap activities={recent.data} />}
        {stats.data && <HomeBests stats={stats.data} />}
        {!isLoading && <BuyMeACoffe />}
      </Animated.ScrollView>

      <CompactHeader title="Home" scrollY={scrollY} />
    </View>
  );
};
