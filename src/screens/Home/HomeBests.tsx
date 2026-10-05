import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AthleteStats } from "../../types";
import { Theme } from "../../theme";
import { IconName } from "../../constants";
import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatNumber,
} from "../../helpers";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SectionTitle } from "../../components/layout/SectionTitle";

type Item = {
  icon: IconName;
  title: string;
  value?: string;
  isBest?: boolean;
};

type Props = {
  stats: AthleteStats;
};

/**
 * Strava only reports two personal bests, so the grid fills out with the
 * lifetime totals from the same stats response, summed across sports.
 */
export const HomeBests = ({ stats }: Props) => {
  const lifetime = [
    stats.all_ride_totals,
    stats.all_run_totals,
    stats.all_swim_totals,
  ].reduce(
    (sum, totals) => ({
      count: sum.count + totals.count,
      distance: sum.distance + totals.distance,
      movingTime: sum.movingTime + totals.moving_time,
      elevation: sum.elevation + totals.elevation_gain,
    }),
    { count: 0, distance: 0, movingTime: 0, elevation: 0 }
  );

  const items: Item[] = [
    {
      icon: "map-marker-path",
      title: "Longest ride",
      value: formatDistance(stats.biggest_ride_distance),
      isBest: true,
    },
    {
      icon: "image-filter-hdr",
      title: "Biggest climb",
      value: formatElevation(stats.biggest_climb_elevation_gain),
      isBest: true,
    },
    {
      icon: "ruler",
      title: "Total distance",
      value: formatDistance(lifetime.distance),
    },
    {
      icon: "timer-outline",
      title: "Total time",
      value: formatDuration(lifetime.movingTime),
    },
    {
      icon: "trending-up",
      title: "Total climbing",
      value: formatElevation(lifetime.elevation),
    },
    {
      icon: "pound",
      title: "Activities",
      value: lifetime.count ? formatNumber(lifetime.count) : undefined,
    },
  ];

  const visible = items.filter(({ value }) => value);
  if (!visible.length) {
    return null;
  }

  const rows: Item[][] = [];
  for (let i = 0; i < visible.length; i += 2) {
    rows.push(visible.slice(i, i + 2));
  }

  return (
    <View>
      <SectionTitle
        title="All-time"
        right={
          <AppText size={13} color={Theme.colors.textMuted}>
            All sports
          </AppText>
        }
      />
      <View style={{ gap: Theme.space.m, paddingHorizontal: Theme.gutter }}>
        {rows.map((row) => (
          <View
            key={row[0].title}
            style={{ flexDirection: "row", gap: Theme.space.m }}
          >
            {row.map((item) => (
              <Card key={item.title} style={{ flex: 1, gap: 6 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={Theme.colors.primaryDark}
                  />
                  {item.isBest && (
                    <View
                      style={{
                        height: 20,
                        paddingHorizontal: 7,
                        borderRadius: 10,
                        justifyContent: "center",
                        backgroundColor: Theme.colors.primaryLight,
                      }}
                    >
                      <AppText bold size={10} color={Theme.colors.primaryDark}>
                        BEST
                      </AppText>
                    </View>
                  )}
                </View>
                <AppText size={13} color={Theme.colors.textMuted}>
                  {item.title}
                </AppText>
                <AppText bold size={20} numberOfLines={1} adjustsFontSizeToFit>
                  {item.value}
                </AppText>
              </Card>
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </View>
    </View>
  );
};
