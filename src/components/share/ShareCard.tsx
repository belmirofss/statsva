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
  stats: TitleAndContent[];
};

type Props = ShareCardContent & {
  cardStyle: ShareCardStyle;
  showRoute: boolean;
  showAthlete: boolean;
};

const ROUTE_HEIGHT = 170;

export const ShareCard = ({
  eyebrow,
  eyebrowRight,
  title,
  hero,
  polyline,
  stats,
  cardStyle,
  showRoute,
  showAthlete,
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

      {title && (
        <AppText bold size={26} color={theme.text} style={{ lineHeight: 30 }}>
          {title}
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
