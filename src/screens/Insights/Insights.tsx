import { useMemo, useState } from "react";
import { Animated, Pressable, RefreshControl, View } from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../theme";
import { IconName } from "../../constants";
import { formatDistance, formatNumber } from "../../helpers";
import { useActivityHistory, historyStart } from "../../hooks/useActivityHistory";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { useStarredSegments } from "../../hooks/useSegments";
import {
  CompactHeader,
  LargeHeader,
  useCollapsingHeader,
} from "../../components/layout/ScreenHeader";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SectionTitle } from "../../components/layout/SectionTitle";
import { LinkRow } from "../../components/LinkRow";
import { Loading } from "../../components/layout/Loading";
import { Error } from "../../components/layout/Error";
import { computeStreak } from "../../insights/streaks";
import { comparePeriods } from "../../insights/compare";
import { fitnessSeries, formZone } from "../../insights/fitness";
import { timeProfile } from "../../insights/timeOfDay";
import { reviewYear, yearReview } from "../../insights/yearReview";
import { mainSport, matchesSport } from "../../insights/sports";
import { EARTH_KM, lifetimeTotals } from "../../insights/perspective";

type Tile = {
  icon: IconName;
  label: string;
  value: string;
  route: "Streaks" | "Compare" | "Fitness" | "Perspective" | "TimeOfDay" | "Explorer";
};

export const Insights = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useCollapsingHeader();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const history = useActivityHistory();
  const stats = useAthleteStats();
  const starred = useStarredSegments();

  const summary = useMemo(() => {
    const activities = history.data;
    if (!activities) return undefined;

    const sport = mainSport(activities);
    const ofSport = activities.filter((a) => matchesSport(sport, a));
    const thisYear = activities.filter(
      (a) => Number(a.start_date_local.slice(0, 4)) === moment().year()
    );
    const streak = computeStreak(activities, "weekly", historyStart());
    const compare = comparePeriods(ofSport, "year");
    const delta = (compare.thisTotals.distance - compare.lastToDate.distance) / 1000;
    const fitness = fitnessSeries(activities, historyStart(), 1);
    const year = reviewYear();

    return {
      review: yearReview(activities, year),
      streak,
      delta,
      form: formZone(fitness.form[fitness.form.length - 1] ?? 0).label,
      persona: timeProfile(thisYear.filter((a) => matchesSport(sport, a))).persona.title,
      routes: thisYear.filter((a) => a.map?.summary_polyline).length,
      latest: activities[0],
    };
  }, [history.data]);

  const earth = stats.data
    ? Math.round((lifetimeTotals(stats.data).distance / 1000 / EARTH_KM) * 100)
    : undefined;

  const tiles: Tile[] = summary
    ? [
        {
          icon: "fire",
          label: "Streaks",
          value: summary.streak.current
            ? `${summary.streak.current}-week streak`
            : "Start a streak",
          route: "Streaks",
        },
        {
          icon: "chart-line",
          label: "vs last year",
          value: `${formatNumber(Math.abs(summary.delta))} km ${
            summary.delta >= 0 ? "ahead" : "behind"
          }`,
          route: "Compare",
        },
        {
          icon: "heart-pulse",
          label: "Form",
          value: summary.form,
          route: "Fitness",
        },
        {
          icon: "earth",
          label: "In perspective",
          value: earth !== undefined ? `${earth}% round Earth` : "Your totals",
          route: "Perspective",
        },
        {
          icon: "clock-outline",
          label: "Time of day",
          value: summary.persona,
          route: "TimeOfDay",
        },
        {
          icon: "map-outline",
          label: "Explorer",
          value: `${formatNumber(summary.routes)} ${summary.routes === 1 ? "route" : "routes"}`,
          route: "Explorer",
        },
      ]
    : [];

  const refresh = async () => {
    setIsRefreshing(true);
    await Promise.all([history.refetch(), stats.refetch(), starred.refetch()]);
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ gap: Theme.space.m, paddingBottom: Theme.space.xl }}
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
        <LargeHeader subtitle={moment().format("dddd, D MMMM")} title="Insights" />

        {history.isLoading && <Loading mode="local" />}
        {history.isError && <Error />}

        {summary?.review && (
          <Pressable
            onPress={() => navigation.navigate("YearInReview")}
            accessibilityRole="button"
            accessibilityLabel={`Your ${summary.review.year} in review`}
            style={({ pressed }) => ({
              marginHorizontal: Theme.gutter,
              borderRadius: Theme.radius.xl,
              backgroundColor: Theme.colors.text,
              padding: Theme.gutter,
              gap: 14,
              overflow: "hidden",
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <View
              style={{
                position: "absolute",
                right: -40,
                top: -40,
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: Theme.colors.primary,
              }}
            />
            <View
              style={{
                position: "absolute",
                right: 30,
                top: 50,
                width: 90,
                height: 90,
                borderRadius: 45,
                borderWidth: 3,
                borderColor: Theme.colors.text,
              }}
            />
            <AppText bold size={12} color={Theme.colors.primaryMuted} style={{ letterSpacing: 1.2 }}>
              YEAR IN REVIEW
            </AppText>
            <AppText bold size={26} color={Theme.colors.white} style={{ lineHeight: 29, maxWidth: 200 }}>
              {`Your ${summary.review.year}\nin review`}
            </AppText>
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                height: 36,
                paddingLeft: 14,
                paddingRight: 8,
                borderRadius: 18,
                backgroundColor: Theme.colors.white,
              }}
            >
              <AppText bold>Watch your year</AppText>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Theme.colors.text} />
            </View>
          </Pressable>
        )}

        {!!tiles.length && (
          <View>
            <SectionTitle title="Your training" />
            <View
              style={{
                paddingHorizontal: Theme.gutter,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {tiles.map((tile) => (
                <Pressable
                  key={tile.route}
                  onPress={() => navigation.navigate(tile.route)}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    width: "47.9%",
                    flexGrow: 1,
                    minHeight: 112,
                    gap: 8,
                    padding: Theme.space.m,
                    borderRadius: Theme.radius.xl,
                    backgroundColor: pressed ? Theme.colors.lightGray : Theme.colors.surface,
                  })}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: Theme.colors.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons name={tile.icon} size={20} color={Theme.colors.primaryDark} />
                  </View>
                  <AppText size={13} color={Theme.colors.textMuted}>
                    {tile.label}
                  </AppText>
                  <AppText bold size={17} numberOfLines={1} adjustsFontSizeToFit>
                    {tile.value}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {summary?.latest && (
          <View>
            <SectionTitle title="Inside each activity" />
            <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: 0 }}>
              <LinkRow
                icon="weather-partly-cloudy"
                title="Weather, pacing and race predictor"
                subtitle={`Open your latest: ${summary.latest.name}`}
                onPress={() => navigation.navigate("Activity", { id: summary.latest.id })}
              />
            </Card>
          </View>
        )}

        {!!starred.data?.length && (
          <View>
            <SectionTitle title="Starred segments" />
            <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: 0 }}>
              {starred.data.slice(0, 5).map((segment, index) => (
                <LinkRow
                  key={segment.id}
                  icon="trophy-outline"
                  title={segment.name}
                  subtitle={[
                    formatDistance(segment.distance),
                    `${segment.average_grade.toFixed(1)}%`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  divided={index > 0}
                  onPress={() =>
                    navigation.navigate("Segment", { id: segment.id, name: segment.name })
                  }
                />
              ))}
            </Card>
          </View>
        )}

        {summary && (
          <View>
            <SectionTitle title="Gear" />
            <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: 0 }}>
              <LinkRow
                icon="shoe-sneaker"
                title="Shoes and bikes"
                subtitle="Mileage and when to replace them"
                onPress={() => navigation.navigate("Gear")}
              />
            </Card>
          </View>
        )}
      </Animated.ScrollView>

      <CompactHeader title="Insights" scrollY={scrollY} />
    </View>
  );
};
