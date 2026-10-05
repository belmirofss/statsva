import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AthleteStats } from "../../types";
import { Theme } from "../../theme";
import { IconName } from "../../constants";
import { formatDistance, formatElevation } from "../../helpers";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { SectionTitle } from "../../components/layout/SectionTitle";

type Props = {
  stats: AthleteStats;
};

export const HomeBests = ({ stats }: Props) => {
  const bests: { icon: IconName; title: string; value?: string }[] = [
    {
      icon: "map-marker-path",
      title: "Longest ride",
      value: formatDistance(stats.biggest_ride_distance),
    },
    {
      icon: "image-filter-hdr",
      title: "Biggest climb",
      value: formatElevation(stats.biggest_climb_elevation_gain),
    },
  ];

  const visible = bests.filter(({ value }) => value);
  if (!visible.length) {
    return null;
  }

  return (
    <View>
      <SectionTitle title="All-time bests" />
      <View
        style={{
          flexDirection: "row",
          gap: Theme.space.m,
          paddingHorizontal: Theme.gutter,
        }}
      >
        {visible.map((best) => (
          <Card key={best.title} style={{ flex: 1, gap: 6 }}>
            <MaterialCommunityIcons
              name={best.icon}
              size={22}
              color={Theme.colors.primaryDark}
            />
            <AppText size={13} color={Theme.colors.textMuted}>
              {best.title}
            </AppText>
            <AppText bold size={20}>
              {best.value}
            </AppText>
          </Card>
        ))}
      </View>
    </View>
  );
};
