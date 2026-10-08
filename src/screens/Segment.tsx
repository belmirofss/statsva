import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Theme } from "../theme";
import { SPORT_TYPE_TO_LABEL } from "../constants";
import {
  activityLocalMoment,
  formatDistance,
  formatNumber,
  formatTime,
} from "../helpers";
import { useSegment, useSegmentEfforts } from "../hooks/useSegments";
import { DetailScreen } from "../components/layout/DetailScreen";
import { Card } from "../components/layout/Card";
import { AppText } from "../components/layout/AppText";
import { SectionTitle } from "../components/layout/SectionTitle";
import { Loading } from "../components/layout/Loading";
import { LineChart } from "../components/LineChart";
import { Legend } from "../components/Legend";
import { LinkRow } from "../components/LinkRow";

type Params = {
  Segment: { id: number; name?: string };
};

const RECENT = 6;

export const Segment = () => {
  const { params } = useRoute<RouteProp<Params, "Segment">>();
  const navigation = useNavigation();
  const segment = useSegment(params.id);
  const efforts = useSegmentEfforts(params.id);

  const data = efforts.data ?? [];
  const times = data.map((effort) => effort.elapsed_time);
  const best = times.length ? Math.min(...times) : undefined;
  const prIndex = best !== undefined ? times.lastIndexOf(best) : -1;
  const pr = data[prIndex];
  const previousBest = prIndex > 0 ? Math.min(...times.slice(0, prIndex)) : undefined;
  const ranked = [...data].sort((a, b) => a.elapsed_time - b.elapsed_time);

  // Running best: the PR as it stood after each effort.
  const bestSoFar: number[] = [];
  times.forEach((time, index) => bestSoFar.push(Math.min(time, bestSoFar[index - 1] ?? Infinity)));

  const stats = segment.data?.athlete_segment_stats;
  const info = segment.data;
  const sport = info?.activity_type ? SPORT_TYPE_TO_LABEL[info.activity_type] ?? info.activity_type : undefined;

  return (
    <DetailScreen
      title={info?.name ?? params.name ?? "Segment"}
      subtitle={["Segment", sport].filter(Boolean).join(" · ")}
      isLoading={segment.isLoading}
      onRefresh={() => Promise.all([segment.refetch(), efforts.refetch()])}
    >
      {info && (
        <AppText color={Theme.colors.textMuted} style={{ paddingHorizontal: Theme.gutter, marginTop: -8 }}>
          {[
            formatDistance(info.distance),
            `${info.average_grade.toFixed(1)}% avg grade`,
            info.total_elevation_gain ? `${formatNumber(info.total_elevation_gain)} m gain` : undefined,
            [info.city, info.country].filter(Boolean).join(", ") || undefined,
          ]
            .filter(Boolean)
            .join(" · ")}
        </AppText>
      )}

      {efforts.isLoading && <Loading mode="local" />}

      {pr && best !== undefined && (
        <Card
          style={{
            marginHorizontal: Theme.gutter,
            backgroundColor: Theme.colors.primary,
            flexDirection: "row",
            alignItems: "center",
            gap: Theme.space.m,
            padding: 18,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="trophy-outline" size={30} color={Theme.colors.white} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText bold size={13} color={Theme.colors.white}>
              Personal record
            </AppText>
            <AppText bold size={36} color={Theme.colors.white} style={{ letterSpacing: -1 }}>
              {formatTime(best)}
            </AppText>
            <AppText size={13} color={Theme.colors.white}>
              {activityLocalMoment(pr.start_date_local).format("D MMM YYYY")}
              {previousBest !== undefined
                ? ` · ${formatNumber(previousBest - best)} s faster than your last PR`
                : ""}
            </AppText>
          </View>
        </Card>
      )}

      {data.length > 0 && (
        <View
          style={{
            marginHorizontal: Theme.gutter,
            flexDirection: "row",
            gap: 1,
            backgroundColor: Theme.colors.border,
            borderRadius: Theme.radius.xl,
            overflow: "hidden",
          }}
        >
          {[
            { title: "Efforts", value: formatNumber(data.length) },
            { title: "First try", value: formatTime(times[0]) ?? "–" },
            {
              title: "Improved",
              value: best !== undefined && times[0] > best ? `−${formatNumber(times[0] - best)} s` : "–",
            },
          ].map((item) => (
            <View key={item.title} style={{ flex: 1, backgroundColor: Theme.colors.surface, padding: 14, gap: 4 }}>
              <AppText size={12} color={Theme.colors.textMuted}>
                {item.title}
              </AppText>
              <AppText bold size={20}>
                {item.value}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {data.length > 1 && (
        <Card style={{ marginHorizontal: Theme.gutter, gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <AppText bold size={16}>
              Every effort
            </AppText>
            <AppText size={12} color={Theme.colors.textMuted}>
              lower is faster
            </AppText>
          </View>
          <View
            accessible
            accessibilityLabel={`Effort times from ${formatTime(times[0])} to ${formatTime(times[times.length - 1])}, best ${formatTime(best)}`}
          >
            <LineChart
              height={150}
              min={Math.min(...times) * 0.97}
              max={Math.max(...times) * 1.02}
              series={[
                { data: times, color: "#9aa1ab", strokeWidth: 1.5 },
                { data: bestSoFar, color: Theme.colors.primary, strokeWidth: 3, endDot: true },
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText size={11} color={Theme.colors.textMuted}>
              {activityLocalMoment(data[0].start_date_local).format("MMM YYYY")}
            </AppText>
            <AppText size={11} color={Theme.colors.textMuted}>
              {activityLocalMoment(data[data.length - 1].start_date_local).format("MMM YYYY")}
            </AppText>
          </View>
          <View style={{ flexDirection: "row", gap: 18 }}>
            <Legend color={Theme.colors.primary} label="PR over time" />
            <Legend color="#9aa1ab" label="Each effort" />
          </View>
        </Card>
      )}

      {data.length > 0 && (
        <View>
          <SectionTitle title="Recent efforts" />
          <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: 0 }}>
            {[...data]
              .reverse()
              .slice(0, RECENT)
              .map((effort, index) => {
                const rank = ranked.indexOf(effort) + 1;
                return (
                  <LinkRow
                    key={effort.id}
                    icon={rank === 1 ? "trophy" : rank <= 3 ? "medal-outline" : "timer-outline"}
                    title={`${formatTime(effort.elapsed_time)}${rank === 1 ? " · PR" : rank <= 3 ? ` · #${rank}` : ""}`}
                    subtitle={activityLocalMoment(effort.start_date_local).format("D MMM YYYY")}
                    divided={index > 0}
                    onPress={() => {
                      if (effort.activity) {
                        navigation.navigate("Activity", { id: effort.activity.id });
                      }
                    }}
                  />
                );
              })}
          </Card>
        </View>
      )}

      {efforts.isLocked && (
        <Card style={{ marginHorizontal: Theme.gutter, gap: 8 }}>
          <AppText bold size={16}>
            Full history needs Strava
          </AppText>
          <AppText color={Theme.colors.textMuted} style={{ lineHeight: 20 }}>
            Strava only shares your list of efforts on a segment with subscribers.
            {stats?.pr_elapsed_time
              ? ` Your PR here is ${formatTime(stats.pr_elapsed_time)}${
                  stats.pr_date ? `, set ${activityLocalMoment(stats.pr_date).format("D MMM YYYY")}` : ""
                }${stats.effort_count ? `, across ${formatNumber(stats.effort_count)} efforts` : ""}.`
              : ""}
          </AppText>
        </Card>
      )}

      {efforts.isError && !efforts.isLocked && (
        <AppText color={Theme.colors.textMuted} style={{ paddingHorizontal: Theme.gutter }}>
          Couldn't load your efforts on this segment. Pull to try again.
        </AppText>
      )}
    </DetailScreen>
  );
};
