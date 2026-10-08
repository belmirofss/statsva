import { useMemo, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Error } from "../../components/layout/Error";
import { Loading } from "../../components/layout/Loading";
import { AppText } from "../../components/layout/AppText";
import { SectionTitle } from "../../components/layout/SectionTitle";
import {
  CompactHeader,
  useCollapsingHeader,
} from "../../components/layout/ScreenHeader";
import { Map } from "../../components/Map";
import { StatGrid } from "../../components/StatGrid";
import { DetailList } from "../../components/DetailList";
import { AdBanner } from "../../components/AdBanner";
import { ShareSheet } from "../../components/share/ShareSheet";
import { useActivity } from "../../hooks/useActivity";
import { useActivityStreams } from "../../hooks/useActivityStreams";
import { useActivityWeather } from "../../hooks/useActivityWeather";
import { SegmentedControl } from "../../components/SegmentedControl";
import { decoupling, pacing, predictRaces } from "../../insights/runAnalysis";
import { isRun } from "../../insights/sports";
import { AD_BANNER_ACTIVITY_UNIT_ID } from "../../constants";
import { Theme } from "../../theme";
import { ActivityTitle } from "./ActivityTitle";
import { ActivityCharts } from "./ActivityCharts";
import { ActivityWeather, formatWeather } from "./ActivityWeather";
import { ActivityAnalysis } from "./ActivityAnalysis";
import {
  ActivityBestEfforts,
  ActivityLaps,
  ActivitySegments,
  ActivitySplits,
} from "./ActivityEfforts";
import { detailStats, mainStats, shareContent } from "./activityDetails";

const MAP_HEIGHT = 280;

type Params = {
  Activity: {
    id: number;
  };
};

export const Activity = () => {
  const { params } = useRoute<RouteProp<Params, "Activity">>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useCollapsingHeader();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [tab, setTab] = useState<"overview" | "analysis">("overview");

  const { data: activity, isLoading, isError } = useActivity({ id: params.id });
  const { data: streams } = useActivityStreams({
    id: params.id,
    enabled: !!activity && !activity.manual,
  });

  const { data: weather } = useActivityWeather(activity);

  const analysis = useMemo(() => {
    if (!activity || !isRun(activity.sport_type)) return undefined;
    const result = {
      pacing: pacing(activity),
      decoupling: streams ? decoupling(streams) : undefined,
      prediction: predictRaces(activity),
    };
    return result.pacing || result.decoupling || result.prediction ? result : undefined;
  }, [activity, streams]);
  const showAnalysis = !!analysis && tab === "analysis";

  const polyline = activity?.map?.polyline || activity?.map?.summary_polyline;
  const heroHeight = polyline ? MAP_HEIGHT : insets.top + 64;

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      {isLoading && <Loading />}
      {isError && <Error />}

      {activity && (
        <>
          <Animated.ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
          >
            <View style={{ height: heroHeight }}>
              {polyline && (
                <Map
                  polyline={polyline}
                  height={MAP_HEIGHT}
                  satellite={isSatellite}
                  showKmMarkers
                  edgePadding={{
                    top: insets.top + 64,
                    right: 32,
                    bottom: 48,
                    left: 32,
                  }}
                />
              )}
              {polyline && (
                <View
                  style={{
                    position: "absolute",
                    top: insets.top + 6,
                    right: 12,
                  }}
                >
                  <MapTypeToggle
                    satellite={isSatellite}
                    onChange={setIsSatellite}
                  />
                </View>
              )}
            </View>

            <View
              style={{
                marginTop: polyline ? -20 : 0,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                backgroundColor: Theme.colors.background,
                paddingTop: Theme.gutter,
                paddingHorizontal: Theme.gutter,
                gap: Theme.space.m,
              }}
            >
              <ActivityTitle activity={activity} />
              <StatGrid variant="tiles" columns={2} items={mainStats(activity)} />
              {analysis && (
                <SegmentedControl
                  value={tab}
                  onChange={setTab}
                  options={[
                    { value: "overview", label: "Overview" },
                    { value: "analysis", label: "Analysis" },
                  ]}
                />
              )}
              {showAnalysis ? (
                <ActivityAnalysis activity={activity} {...analysis} />
              ) : (
                <>
                  {weather && <ActivityWeather weather={weather} />}
                  {streams && <ActivityCharts streams={streams} />}
                  <View>
                    <SectionTitle title="Details" inset={false} />
                    <DetailList items={detailStats(activity)} />
                  </View>
                  <ActivitySplits activity={activity} />
                  <ActivityBestEfforts activity={activity} />
                  <ActivityLaps activity={activity} />
                  <ActivitySegments activity={activity} />
                </>
              )}
            </View>

            <View style={{ marginTop: Theme.space.m }}>
              <AdBanner adUnitId={AD_BANNER_ACTIVITY_UNIT_ID} />
            </View>
          </Animated.ScrollView>

          <CompactHeader
            title={activity.name}
            scrollY={scrollY}
            showAfter={heroHeight}
          />

          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: Theme.gutter,
              paddingTop: 12,
              paddingBottom: insets.bottom + 12,
              backgroundColor: Theme.colors.surface,
              borderTopWidth: 1,
              borderTopColor: Theme.colors.border,
            }}
          >
            <Pressable
              onPress={() => setIsShareOpen(true)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                height: 52,
                borderRadius: Theme.radius.l,
                backgroundColor: Theme.colors.primaryDark,
                opacity: pressed ? 0.85 : 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: Theme.space.s,
              })}
            >
              <MaterialCommunityIcons
                name="export-variant"
                size={20}
                color={Theme.colors.white}
              />
              <AppText bold size={16} color={Theme.colors.white}>
                Share activity
              </AppText>
            </Pressable>
          </View>

          <ShareSheet
            visible={isShareOpen}
            onDismiss={() => setIsShareOpen(false)}
            fileName={`Stats-va - Activity ${activity.id}`}
            content={{
              ...shareContent(activity),
              weather: weather ? formatWeather(weather) : undefined,
            }}
          />
        </>
      )}

      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          top: insets.top + 6,
          left: 12,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: Theme.colors.surface,
          alignItems: "center",
          justifyContent: "center",
          elevation: 3,
          shadowColor: Theme.colors.text,
          shadowOpacity: 0.16,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={26}
          color={Theme.colors.text}
        />
      </Pressable>
    </View>
  );
};

type MapTypeToggleProps = {
  satellite: boolean;
  onChange: (satellite: boolean) => void;
};

const MapTypeToggle = ({ satellite, onChange }: MapTypeToggleProps) => (
  <View
    accessibilityRole="radiogroup"
    accessibilityLabel="Map type"
    style={{
      height: 44,
      padding: 4,
      flexDirection: "row",
      gap: 2,
      borderRadius: 22,
      backgroundColor: Theme.colors.surface,
      elevation: 3,
      shadowColor: Theme.colors.text,
      shadowOpacity: 0.16,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    }}
  >
    {[
      { label: "Map", value: false },
      { label: "Satellite", value: true },
    ].map((option) => {
      const active = option.value === satellite;
      return (
        <Pressable
          key={option.label}
          onPress={() => onChange(option.value)}
          accessibilityRole="radio"
          accessibilityState={{ checked: active }}
          style={{
            height: 36,
            paddingHorizontal: 12,
            borderRadius: 18,
            justifyContent: "center",
            backgroundColor: active ? Theme.colors.primary : "transparent",
          }}
        >
          <AppText
            bold
            size={13}
            color={active ? Theme.colors.white : Theme.colors.text}
          >
            {option.label}
          </AppText>
        </Pressable>
      );
    })}
  </View>
);
