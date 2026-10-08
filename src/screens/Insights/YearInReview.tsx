import { ReactNode, useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../theme";
import {
  activityLocalMoment,
  formatDistance,
  formatDuration,
  formatKilometers,
  formatNumber,
  formatSpeedForSport,
} from "../../helpers";
import { useActivityHistory } from "../../hooks/useActivityHistory";
import { useAppContext } from "../../hooks/useAppContext";
import { AppText } from "../../components/layout/AppText";
import { Loading } from "../../components/layout/Loading";
import { RouteArt } from "../../components/RouteArt";
import { ShareSheet } from "../../components/share/ShareSheet";
import { YearReview, reviewYear, yearReview } from "../../insights/yearReview";
import { passedMilestone } from "../../insights/perspective";
import { formatHour, localStartHour } from "../../insights/dates";

type SlideTheme = { background: string; text: string; track: string; muted: string; tile: string };

const ORANGE: SlideTheme = { background: Theme.colors.primary, text: "#fff", track: "rgba(255,255,255,0.35)", muted: "rgba(255,255,255,0.9)", tile: "rgba(255,255,255,0.18)" };
const DARK: SlideTheme = { background: Theme.colors.text, text: "#fff", track: "rgba(255,255,255,0.25)", muted: "#b6bcc6", tile: "#1e2024" };
const PEACH: SlideTheme = { background: Theme.colors.primaryMuted, text: Theme.colors.text, track: "rgba(21,23,26,0.2)", muted: "#3d434c", tile: "rgba(255,255,255,0.5)" };
const LIGHT: SlideTheme = { background: Theme.colors.background, text: Theme.colors.text, track: "rgba(21,23,26,0.15)", muted: Theme.colors.textMuted, tile: Theme.colors.surface };

const MONTH_LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const SIDE = 28;

type Slide = { theme: SlideTheme; render: () => ReactNode };

const StatTile = ({ label, value, theme }: { label: string; value: string; theme: SlideTheme }) => (
  <View style={{ flex: 1, backgroundColor: theme.tile, borderRadius: Theme.radius.xl, padding: 18, gap: 4 }}>
    <AppText size={13} color={theme.muted}>
      {label}
    </AppText>
    <AppText bold size={24} color={theme.text} numberOfLines={1} adjustsFontSizeToFit>
      {value}
    </AppText>
  </View>
);

function buildSlides(
  review: YearReview,
  firstName: string | undefined,
  width: number
): Slide[] {
  const km = formatKilometers(review.distance) ?? "0";
  const passed = passedMilestone(review.distance / 1000);
  const totalSeconds = review.sports.reduce((sum, s) => sum + s.seconds, 0) || 1;
  const top = review.sports[0];
  const topSeconds = review.sports[0]?.seconds || 1;
  const biggest = review.biggest;
  const maxMonth = Math.max(1, ...review.months);

  return [
    {
      theme: ORANGE,
      render: () => (
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ gap: 12 }}>
            <AppText bold size={18} color={ORANGE.text}>
              {firstName ? `Hey ${firstName},` : "Hey there,"}
            </AppText>
            <AppText bold size={40} color={ORANGE.text} style={{ lineHeight: 44, letterSpacing: -0.8 }}>
              this was your year in motion.
            </AppText>
          </View>
          <AppText bold size={128} color={ORANGE.text} style={{ letterSpacing: -6, lineHeight: 130 }}>
            {review.year}
          </AppText>
          <AppText color={ORANGE.muted}>Tap to continue</AppText>
        </View>
      ),
    },
    {
      theme: DARK,
      render: () => (
        <View style={{ gap: 24 }}>
          <AppText bold size={20} color={Theme.colors.primaryMuted}>
            You covered
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <AppText bold size={88} color={DARK.text} style={{ letterSpacing: -4, lineHeight: 92 }} numberOfLines={1} adjustsFontSizeToFit>
              {km}
            </AppText>
            <AppText bold size={28} color={DARK.text}>
              km
            </AppText>
          </View>
          {passed && (
            <AppText size={18} color={DARK.muted} style={{ lineHeight: 26 }}>
              That's further than {passed.label === "A marathon" ? "a marathon" : passed.label}, one activity at a time.
            </AppText>
          )}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <StatTile theme={DARK} label="Activities" value={formatNumber(review.count)} />
              <StatTile theme={DARK} label="Moving time" value={formatDuration(review.movingTime) ?? "0m"} />
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <StatTile theme={DARK} label="Elevation" value={`${formatNumber(review.elevation)} m`} />
              <StatTile theme={DARK} label="Active days" value={formatNumber(review.activeDays)} />
            </View>
          </View>
        </View>
      ),
    },
    {
      theme: PEACH,
      render: () => (
        <View style={{ gap: 20 }}>
          <AppText bold size={20} color={PEACH.text}>
            Your sport was
          </AppText>
          <AppText bold size={60} color={PEACH.text} style={{ letterSpacing: -2, lineHeight: 64 }} numberOfLines={1} adjustsFontSizeToFit>
            {top?.label ?? "—"}
          </AppText>
          {top && (
            <AppText size={18} color={PEACH.text} style={{ lineHeight: 26 }}>
              {Math.round((top.seconds / totalSeconds) * 100)}% of your moving time, across{" "}
              {formatNumber(top.count)} {top.count === 1 ? "session" : top.plural}.
            </AppText>
          )}
          <View style={{ gap: 14, marginTop: 12 }}>
            {review.sports.slice(0, 4).map((sport) => (
              <View key={sport.label} style={{ gap: 6 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <AppText bold size={15} color={PEACH.text}>
                    {sport.label}
                  </AppText>
                  <AppText bold size={15} color={PEACH.text}>
                    {formatNumber(sport.seconds / 3600)}h
                  </AppText>
                </View>
                <View style={{ height: 14, borderRadius: 7, backgroundColor: "rgba(21,23,26,0.12)", overflow: "hidden" }}>
                  <View
                    style={{
                      height: 14,
                      borderRadius: 7,
                      width: `${Math.max(3, (sport.seconds / topSeconds) * 100)}%`,
                      backgroundColor: Theme.colors.text,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      theme: LIGHT,
      render: () =>
        biggest ? (
          <View style={{ gap: 18 }}>
            <AppText bold size={20} color={Theme.colors.primaryDark}>
              Your biggest day
            </AppText>
            <AppText bold size={40} style={{ letterSpacing: -1, lineHeight: 44 }} numberOfLines={3}>
              {biggest.name}
            </AppText>
            <AppText color={Theme.colors.textMuted} size={16}>
              {activityLocalMoment(biggest.start_date_local).format("D MMMM YYYY")}
            </AppText>
            {biggest.map?.summary_polyline ? (
              <View style={{ height: 240, borderRadius: 24, backgroundColor: Theme.colors.surface, overflow: "hidden" }}>
                <RouteArt
                  polyline={biggest.map.summary_polyline}
                  width={width}
                  height={240}
                  color={Theme.colors.primary}
                  strokeWidth={5}
                  padding={28}
                  startColor={Theme.colors.text}
                />
              </View>
            ) : null}
            <View style={{ flexDirection: "row", gap: 28 }}>
              {[
                { label: "Distance", value: formatDistance(biggest.distance) },
                { label: "Time", value: formatDuration(biggest.moving_time) },
                { label: "Avg", value: formatSpeedForSport(biggest.sport_type, biggest.average_speed) },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <View key={item.label} style={{ gap: 2 }}>
                    <AppText size={13} color={Theme.colors.textMuted}>
                      {item.label}
                    </AppText>
                    <AppText bold size={22}>
                      {item.value}
                    </AppText>
                  </View>
                ))}
            </View>
          </View>
        ) : null,
    },
    {
      theme: DARK,
      render: () => (
        <View style={{ gap: 20 }}>
          <AppText bold size={20} color={Theme.colors.primaryMuted}>
            Your rhythm
          </AppText>
          <AppText bold size={36} color={DARK.text} style={{ letterSpacing: -1, lineHeight: 40 }}>
            {MONTH_NAMES[review.busiestMonth]} was on fire. {formatKilometers(review.months[review.busiestMonth]) ?? 0} km.
          </AppText>
          <View style={{ height: 190, flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
            {review.months.map((meters, month) => (
              <View key={month} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    width: "100%",
                    height: Math.max(3, (meters / maxMonth) * 160),
                    borderRadius: 6,
                    backgroundColor: month === review.busiestMonth ? Theme.colors.primary : "#3a3e45",
                  }}
                />
                <AppText size={11} color={DARK.muted}>
                  {MONTH_LETTERS[month]}
                </AppText>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {review.favouriteWeekday && (
              <StatTile theme={DARK} label="Favourite day" value={review.favouriteWeekday} />
            )}
            {review.earliest && (
              <StatTile theme={DARK} label="Earliest start" value={formatHour(localStartHour(review.earliest))} />
            )}
          </View>
        </View>
      ),
    },
  ];
}

export const YearInReview = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { me } = useAppContext();
  const history = useActivityHistory();
  const [index, setIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const review = useMemo(
    () => history.data && yearReview(history.data, reviewYear()),
    [history.data]
  );
  const slides = useMemo(
    () => (review ? buildSlides(review, me?.firstname, width - SIDE * 2) : []),
    [review, me?.firstname, width]
  );

  const total = slides.length + 1;
  const isLast = index === total - 1;
  const theme = isLast ? LIGHT : slides[index]?.theme ?? LIGHT;
  const go = (step: number) => setIndex((i) => Math.max(0, Math.min(total - 1, i + step)));

  if (!review) {
    return (
      <View style={{ flex: 1, backgroundColor: LIGHT.background, justifyContent: "center" }}>
        {history.isLoading ? (
          <Loading />
        ) : (
          <AppText style={{ textAlign: "center" }}>No activities to review yet.</AppText>
        )}
      </View>
    );
  }

  const km = formatKilometers(review.distance) ?? "0";

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.text === "#fff" ? "light" : "dark"} />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 96,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: SIDE,
        }}
      >
        {isLast ? (
          <View style={{ flex: 1, gap: 20 }}>
            <View
              style={{
                backgroundColor: Theme.colors.primary,
                borderRadius: 28,
                padding: 26,
                gap: 22,
                overflow: "hidden",
              }}
            >
              <AppText bold size={14} color="#fff" style={{ letterSpacing: 1 }}>
                MY {review.year}
              </AppText>
              <AppText bold size={60} color="#fff" style={{ letterSpacing: -3, lineHeight: 62 }} numberOfLines={1} adjustsFontSizeToFit>
                {km} km
              </AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 18 }}>
                {[
                  { label: "Activities", value: formatNumber(review.count) },
                  { label: "Hours", value: formatNumber(review.movingTime / 3600) },
                  { label: "Top sport", value: review.sports[0]?.label ?? "—" },
                  { label: "Longest", value: formatDistance(review.biggest?.distance) ?? "—" },
                ].map((item) => (
                  <View key={item.label} style={{ width: "50%", gap: 2 }}>
                    <AppText size={13} color="rgba(255,255,255,0.9)">
                      {item.label}
                    </AppText>
                    <AppText bold size={22} color="#fff">
                      {item.value}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          slides[index]?.render()
        )}
      </View>

      {/* Tap zones: left third goes back, the rest moves forward. */}
      <View style={{ position: "absolute", left: 0, right: 0, top: insets.top + 110, bottom: isLast ? 180 + insets.bottom : 0, flexDirection: "row" }}>
        <Pressable style={{ flex: 1 }} onPress={() => go(-1)} accessibilityRole="button" accessibilityLabel="Previous" />
        <Pressable style={{ flex: 2 }} onPress={() => go(1)} accessibilityRole="button" accessibilityLabel="Next" />
      </View>

      <View style={{ position: "absolute", left: 16, right: 16, top: insets.top + 12, gap: 6 }}>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {Array.from({ length: total }, (_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: i <= index ? theme.text : theme.track,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <AppText bold size={13} color={theme.text}>
            Stats-va · {review.year}
          </AppText>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", marginRight: -10 }}
          >
            <MaterialCommunityIcons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>
      </View>

      {isLast && (
        <View
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: insets.bottom + 24,
            gap: Theme.space.s,
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
            <MaterialCommunityIcons name="export-variant" size={20} color="#fff" />
            <AppText bold size={16} color="#fff">
              Share my year
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => setIndex(0)}
            accessibilityRole="button"
            style={{ height: 44, alignItems: "center", justifyContent: "center" }}
          >
            <AppText bold size={15}>
              Watch again
            </AppText>
          </Pressable>
        </View>
      )}

      <ShareSheet
        visible={isShareOpen}
        onDismiss={() => setIsShareOpen(false)}
        fileName={`Stats-va - ${review.year} in review`}
        content={{
          eyebrow: `My ${review.year}`,
          eyebrowRight: "Year in review",
          hero: {
            value: km,
            unit: "km",
            caption: `${formatNumber(review.count)} activities · ${formatNumber(review.activeDays)} active days`,
          },
          stats: [
            { title: "Moving time", content: formatDuration(review.movingTime) },
            { title: "Elevation", content: `${formatNumber(review.elevation)} m` },
            { title: "Top sport", content: review.sports[0]?.label },
            { title: "Longest", content: formatDistance(review.biggest?.distance) },
            { title: "Best month", content: MONTH_NAMES[review.busiestMonth] },
            { title: "Favourite day", content: review.favouriteWeekday },
          ],
        }}
      />
    </View>
  );
};
