import { useState } from "react";
import { View } from "react-native";
import { TitleAndContent } from "../../types";
import { Theme } from "../../theme";
import { ShareCardStyle } from "../../hooks/useShareCardPrefs";
import { AppText } from "../layout/AppText";
import { RouteArt } from "../RouteArt";
import { ShareFooter } from "../ShareFooter";

type CardTheme = {
  background: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  route: string;
};

export const SHARE_CARD_THEMES: { [key in ShareCardStyle]: CardTheme } = {
  light: {
    background: "#ffffff",
    text: Theme.colors.text,
    muted: Theme.colors.textMuted,
    line: Theme.colors.border,
    accent: Theme.colors.primaryDark,
    route: Theme.colors.primary,
  },
  dark: {
    background: Theme.colors.text,
    text: "#ffffff",
    muted: "#b4bac4",
    line: "#2e3238",
    accent: Theme.colors.primary,
    route: Theme.colors.primary,
  },
  orange: {
    background: Theme.colors.primary,
    text: "#ffffff",
    muted: "rgba(255,255,255,0.85)",
    line: "rgba(255,255,255,0.35)",
    accent: "#ffffff",
    route: "#ffffff",
  },
  clear: {
    background: "transparent",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.85)",
    line: "rgba(255,255,255,0.4)",
    accent: "#ffffff",
    route: "#ffffff",
  },
};

export type ShareCardContent = {
  eyebrow: string;
  eyebrowRight?: string;
  title?: string;
  hero?: { value: string; unit: string; caption?: string };
  polyline?: string;
  /** Several routes drawn as a grid, for posters. */
  routes?: string[];
  /** Conditions at the start, e.g. "27° · Clear sky". */
  weather?: string;
  stats: TitleAndContent[];
};

type Props = ShareCardContent & {
  cardStyle: ShareCardStyle;
  showRoute: boolean;
  showAthlete: boolean;
  showWeather: boolean;
};

const ROUTE_HEIGHT = 170;
const GRID_GAP = 6;

/** Up to 36 routes as small line art tiles, as many columns as reads well. */
const RouteGrid = ({
  routes,
  width,
  color,
}: {
  routes: string[];
  width: number;
  color: string;
}) => {
  const shown = routes.slice(0, 36);
  const columns = shown.length <= 4 ? 2 : shown.length <= 9 ? 3 : shown.length <= 16 ? 4 : shown.length <= 25 ? 5 : 6;
  const size = (width - GRID_GAP * (columns - 1)) / columns;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP }}>
      {shown.map((route, index) => (
        <RouteArt
          key={index}
          polyline={route}
          width={size}
          height={size}
          color={color}
          strokeWidth={columns > 4 ? 1.5 : 2}
          padding={4}
        />
      ))}
    </View>
  );
};

export const ShareCard = ({
  eyebrow,
  eyebrowRight,
  title,
  hero,
  polyline,
  routes,
  weather,
  stats,
  cardStyle,
  showRoute,
  showAthlete,
  showWeather,
}: Props) => {
  const theme = SHARE_CARD_THEMES[cardStyle];
  const [width, setWidth] = useState(0);
  const visibleStats = stats.filter(({ content }) => content !== undefined);

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{
        backgroundColor: theme.background,
        padding: Theme.gutter,
        gap: Theme.space.m,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText bold size={12} color={theme.muted}>
          {eyebrow.toUpperCase()}
        </AppText>
        {eyebrowRight && (
          <AppText bold size={12} color={theme.muted}>
            {eyebrowRight.toUpperCase()}
          </AppText>
        )}
      </View>

      {showRoute && polyline && width > 0 && (
        <RouteArt
          polyline={polyline}
          width={width - Theme.gutter * 2}
          height={ROUTE_HEIGHT}
          color={theme.route}
          strokeWidth={3.5}
          startColor={theme.text}
        />
      )}

      {showRoute && routes && width > 0 && (
        <RouteGrid
          routes={routes}
          width={width - Theme.gutter * 2}
          color={theme.route}
        />
      )}

      {title && (
        <AppText bold size={26} color={theme.text} style={{ lineHeight: 30 }}>
          {title}
        </AppText>
      )}

      {showWeather && weather && (
        <AppText bold size={14} color={theme.muted} style={{ marginTop: -8 }}>
          {weather}
        </AppText>
      )}

      {hero && (
        <View>
          <View
            style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}
          >
            <AppText bold size={56} color={theme.text} style={{ letterSpacing: -1.5 }}>
              {hero.value}
            </AppText>
            <AppText size={20} color={theme.muted}>
              {hero.unit}
            </AppText>
          </View>
          {hero.caption && (
            <AppText size={14} color={theme.muted}>
              {hero.caption}
            </AppText>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: Theme.space.m,
          paddingTop: Theme.space.m,
          borderTopWidth: 1,
          borderTopColor: theme.line,
        }}
      >
        {visibleStats.map(({ title: label, content }) => (
          <View key={label} style={{ width: "33.33%", gap: 2 }}>
            <AppText size={11} color={theme.muted}>
              {label}
            </AppText>
            <AppText bold size={18} color={theme.text} numberOfLines={1} adjustsFontSizeToFit>
              {content}
            </AppText>
          </View>
        ))}
      </View>

      <View
        style={{
          paddingTop: Theme.space.m,
          borderTopWidth: 1,
          borderTopColor: theme.line,
        }}
      >
        <ShareFooter
          color={theme.text}
          mutedColor={theme.muted}
          accentColor={theme.accent}
          showAthlete={showAthlete}
        />
      </View>
    </View>
  );
};
