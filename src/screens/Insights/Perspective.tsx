import { useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { IconName } from "../../constants";
import { formatNumber } from "../../helpers";
import { useAthleteStats } from "../../hooks/useAthleteStats";
import { DetailScreen, PrimaryButton } from "../../components/layout/DetailScreen";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { ShareSheet } from "../../components/share/ShareSheet";
import {
  EARTH_KM,
  EIFFEL_M,
  EVEREST_M,
  MARATHON_KM,
  MOON_KM,
  lifetimeTotals,
  nextMilestone,
  passedMilestone,
  yearToDateDistance,
} from "../../insights/perspective";

type Fact = {
  icon: IconName;
  value: string;
  caption: string;
};

const ProgressBar = ({ ratio, height = 10 }: { ratio: number; height?: number }) => (
  <View
    style={{
      height,
      borderRadius: height / 2,
      backgroundColor: Theme.colors.control,
      overflow: "hidden",
    }}
  >
    <View
      style={{
        height,
        width: `${Math.max(1, Math.min(100, ratio * 100))}%`,
        borderRadius: height / 2,
        backgroundColor: Theme.colors.primary,
      }}
    />
  </View>
);

export const Perspective = () => {
  const stats = useAthleteStats();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const totals = stats.data ? lifetimeTotals(stats.data) : undefined;
  const km = (totals?.distance ?? 0) / 1000;
  const earth = km / EARTH_KM;
  const hours = (totals?.movingTime ?? 0) / 3600;

  const ytdKm = stats.data ? yearToDateDistance(stats.data) / 1000 : 0;
  const yearPace = ytdKm / (moment().dayOfYear() / 365);
  const moonYears = yearPace ? (MOON_KM - km) / yearPace : undefined;

  const next = nextMilestone(km);
  const passed = passedMilestone(km);

  const facts: Fact[] = [
    {
      icon: "image-filter-hdr",
      value: `${formatNumber((totals?.elevation ?? 0) / EVEREST_M, 1)}×`,
      caption: `Everest climbed, from ${formatNumber(totals?.elevation ?? 0)} m of elevation`,
    },
    {
      icon: "stairs-up",
      value: formatNumber((totals?.elevation ?? 0) / EIFFEL_M),
      caption: "Eiffel Towers stacked on top of each other",
    },
    {
      icon: "flag-checkered",
      value: formatNumber(km / MARATHON_KM),
      caption: "marathons' worth of distance (42.2 km each)",
    },
    {
      icon: "clock-outline",
      value: `${formatNumber(hours / 24)} days`,
      caption: `of non-stop moving, from ${formatNumber(hours)} hours`,
    },
  ];

  return (
    <DetailScreen
      title="In perspective"
      subtitle="Ride, run and swim · All time"
      isLoading={stats.isLoading}
      isError={stats.isError}
      onRefresh={stats.refetch}
    >
      {totals && (
        <>
          <Card
            style={{
              marginHorizontal: Theme.gutter,
              backgroundColor: Theme.colors.text,
              padding: Theme.gutter,
              gap: Theme.space.m,
            }}
          >
            <AppText size={13} color="#b6bcc6">
              Around the Earth
            </AppText>
            <AppText bold size={52} color={Theme.colors.white} style={{ letterSpacing: -1.5 }}>
              {formatNumber(earth * 100, earth < 0.1 ? 1 : 0)}%
            </AppText>
            <View
              style={{
                height: 12,
                borderRadius: 6,
                backgroundColor: "#33363c",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 12,
                  width: `${Math.max(1, Math.min(100, earth * 100))}%`,
                  backgroundColor: Theme.colors.primary,
                }}
              />
            </View>
            <AppText color="#e3e5e8">
              {formatNumber(km)} km done.{" "}
              {earth < 1
                ? `${formatNumber(EARTH_KM - km)} km to go.`
                : `That's ${formatNumber(earth, 1)} laps of the planet.`}
            </AppText>
          </Card>

          <View
            style={{
              paddingHorizontal: Theme.gutter,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {facts.map((fact) => (
              <Card key={fact.icon} style={{ width: "47.9%", flexGrow: 1, gap: 8 }}>
                <MaterialCommunityIcons name={fact.icon} size={30} color={Theme.colors.primaryDark} />
                <AppText bold size={28} numberOfLines={1} adjustsFontSizeToFit style={{ letterSpacing: -0.8 }}>
                  {fact.value}
                </AppText>
                <AppText size={13} color={Theme.colors.textMuted} style={{ lineHeight: 18 }}>
                  {fact.caption}
                </AppText>
              </Card>
            ))}
          </View>

          <Card style={{ marginHorizontal: Theme.gutter, gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <AppText bold size={16}>
                Trip to the Moon
              </AppText>
              <AppText size={13} color={Theme.colors.textMuted}>
                {formatNumber(MOON_KM)} km
              </AppText>
            </View>
            <ProgressBar ratio={km / MOON_KM} height={8} />
            <AppText style={{ lineHeight: 20 }}>
              {formatNumber((km / MOON_KM) * 100, 1)}% of the way there.
              {moonYears && moonYears > 0
                ? ` At this year's pace you'd land in ${formatNumber(moonYears)} years.`
                : ""}
            </AppText>
          </Card>

          {next && (
            <Card style={{ marginHorizontal: Theme.gutter, gap: 10 }}>
              <AppText bold size={16}>
                Next milestone
              </AppText>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: Theme.space.m }}>
                <AppText style={{ flex: 1 }}>{next.label}</AppText>
                <AppText bold>{formatNumber((km / next.distance) * 100)}%</AppText>
              </View>
              <ProgressBar ratio={km / next.distance} />
              <AppText size={13} color={Theme.colors.textMuted}>
                {formatNumber(next.distance - km)} km to go.
                {passed ? ` Already passed: ${passed.label} (${formatNumber(passed.distance)} km).` : ""}
              </AppText>
            </Card>
          )}

          <View style={{ paddingHorizontal: Theme.gutter }}>
            <PrimaryButton
              label="Share as a card"
              icon="export-variant"
              onPress={() => setIsShareOpen(true)}
            />
          </View>

          <ShareSheet
            visible={isShareOpen}
            onDismiss={() => setIsShareOpen(false)}
            fileName="Stats-va - In perspective"
            content={{
              eyebrow: "In perspective",
              eyebrowRight: "All time",
              hero: {
                value: `${formatNumber(earth * 100, earth < 0.1 ? 1 : 0)}%`,
                unit: "around the Earth",
                caption: `${formatNumber(km)} km of riding, running and swimming`,
              },
              stats: [
                { title: "Everests", content: facts[0].value },
                { title: "Marathons", content: facts[2].value },
                { title: "Non-stop", content: facts[3].value },
              ],
            }}
          />
        </>
      )}
    </DetailScreen>
  );
};
