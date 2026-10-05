import { useMemo, useState } from "react";
import { Animated, RefreshControl, View } from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActivities } from "../../hooks/useActivities";
import { Loading } from "../../components/layout/Loading";
import { Error } from "../../components/layout/Error";
import { AppText } from "../../components/layout/AppText";
import {
  CompactHeader,
  LargeHeader,
  useCollapsingHeader,
} from "../../components/layout/ScreenHeader";
import { ChipGroup } from "../../components/ChipGroup";
import { ActivityRow } from "../../components/ActivityRow";
import { AdBanner } from "../../components/AdBanner";
import { SportType, SummaryActivity } from "../../types";
import { formatDistance } from "../../helpers";
import { Theme } from "../../theme";
import {
  AD_BANNER_ACTIVITIES_UNIT_ID,
  IconName,
  RIDE_SPORT_TYPES,
  RUN_SPORT_TYPES,
} from "../../constants";

type Filter = "all" | "ride" | "run" | "swim" | "other";

const FILTERS: { value: Filter; label: string; icon?: IconName }[] = [
  { value: "all", label: "All" },
  { value: "ride", label: "Ride", icon: "bike" },
  { value: "run", label: "Run", icon: "run" },
  { value: "swim", label: "Swim", icon: "swim" },
  { value: "other", label: "Other" },
];

const matchesFilter = (filter: Filter, sportType: SportType) => {
  const isRide = RIDE_SPORT_TYPES.includes(sportType);
  const isRun = RUN_SPORT_TYPES.includes(sportType);
  const isSwim = sportType === SportType.SWIM;

  switch (filter) {
    case "ride":
      return isRide;
    case "run":
      return isRun;
    case "swim":
      return isSwim;
    case "other":
      return !isRide && !isRun && !isSwim;
    default:
      return true;
  }
};

type Section = {
  key: string;
  title: string;
  summary: string;
  data: SummaryActivity[];
};

const groupByMonth = (activities: SummaryActivity[]): Section[] => {
  const sections: Section[] = [];

  activities.forEach((activity) => {
    const key = activity.start_date_local.slice(0, 7);
    const last = sections[sections.length - 1];
    if (last?.key === key) {
      last.data.push(activity);
    } else {
      sections.push({
        key,
        title: moment.utc(`${key}-01`).format("MMMM YYYY"),
        summary: "",
        data: [activity],
      });
    }
  });

  return sections.map((section) => {
    const count = section.data.length;
    const distance = section.data.reduce((sum, a) => sum + a.distance, 0);
    const parts = [`${count} ${count === 1 ? "activity" : "activities"}`];
    const formattedDistance = formatDistance(distance);
    if (formattedDistance) {
      parts.push(formattedDistance);
    }
    return { ...section, summary: parts.join(" · ") };
  });
};

export const Activities = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useCollapsingHeader();
  const [filter, setFilter] = useState<Filter>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useActivities();

  const sections = useMemo(() => {
    const activities = data?.pages.flat() ?? [];
    return groupByMonth(
      activities.filter((activity) =>
        matchesFilter(filter, activity.sport_type)
      )
    );
  }, [data, filter]);

  const renderEmpty = () => {
    if (isLoading) {
      return <Loading mode="local" />;
    }
    if (isError) {
      return <Error />;
    }
    if (isFetchingNextPage || hasNextPage) {
      return null;
    }
    return (
      <AppText
        color={Theme.colors.textMuted}
        style={{ textAlign: "center", padding: Theme.space.l }}
      >
        No activities here yet.
      </AppText>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Animated.SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: Theme.space.xl }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            colors={[Theme.colors.primary]}
            tintColor={Theme.colors.primary}
            progressViewOffset={insets.top}
          />
        }
        ListHeaderComponent={
          <View style={{ paddingBottom: Theme.space.s }}>
            <LargeHeader title="Activities" subtitle="Synced from Strava" />
            <ChipGroup
              variant="solid"
              scrollable
              value={filter}
              onChange={setFilter}
              options={FILTERS}
            />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingHorizontal: Theme.gutter,
              paddingTop: Theme.gutter,
              paddingBottom: Theme.space.s,
            }}
          >
            <AppText bold size={16} accessibilityRole="header">
              {section.title}
            </AppText>
            <AppText size={13} color={Theme.colors.textMuted}>
              {section.summary}
            </AppText>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <ActivityRow
            activity={item}
            isFirst={index === 0}
            isLast={index === section.data.length - 1}
            onPress={() => navigation.navigate("Activity", { id: item.id })}
          />
        )}
        renderSectionFooter={({ section }) =>
          section.key === sections[0]?.key ? (
            <View style={{ marginTop: Theme.space.m }}>
              <AdBanner adUnitId={AD_BANNER_ACTIVITIES_UNIT_ID} />
            </View>
          ) : null
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          isFetchingNextPage ? <Loading mode="local" /> : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />

      <CompactHeader title="Activities" scrollY={scrollY} />
    </View>
  );
};
