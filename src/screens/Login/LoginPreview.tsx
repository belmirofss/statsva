import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { AppText } from "../../components/layout/AppText";

const HEATMAP_COLORS = [
  "#eceef1",
  Theme.colors.primaryMuted,
  "#fd8a57",
  Theme.colors.primary,
];

// Decorative sample, not the athlete's data.
const HEATMAP_ROWS = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 12 }, (_, week) => {
    const n = ((week * 7 + day) * 37) % 11;
    return HEATMAP_COLORS[n < 5 ? 0 : n < 8 ? 1 : n < 10 ? 2 : 3];
  })
);

const SAMPLE_BARS = [38, 52, 32, 49];

const cardShadow = (opacity: number, radius: number) => ({
  elevation: Math.round(radius / 3),
  shadowColor: Theme.colors.text,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: radius / 2 },
});

/** The illustration at the top of Login: a peek at what the app shows. */
export const LoginPreview = () => {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ height: 340, width: 342, alignSelf: "center" }}
    >
      <View
        style={{
          position: "absolute",
          left: 20,
          top: 40,
          width: 250,
          padding: Theme.space.m,
          gap: 10,
          borderRadius: Theme.radius.xl,
          backgroundColor: Theme.colors.surface,
          transform: [{ rotate: "-7deg" }],
          ...cardShadow(0.08, 18),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText bold size={12}>
            Last 12 weeks
          </AppText>
          <AppText size={12} color={Theme.colors.textMuted}>
            61 activities
          </AppText>
        </View>
        <View style={{ gap: 3 }}>
          {HEATMAP_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: "row", gap: 3 }}>
              {row.map((color, cellIndex) => (
                <View
                  key={cellIndex}
                  style={{
                    flex: 1,
                    aspectRatio: 1,
                    borderRadius: 3,
                    backgroundColor: color,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          left: 72,
          top: 136,
          width: 250,
          paddingVertical: Theme.space.m,
          paddingHorizontal: 18,
          gap: 10,
          borderRadius: Theme.radius.xl,
          backgroundColor: Theme.colors.surface,
          transform: [{ rotate: "4deg" }],
          ...cardShadow(0.14, 24),
        }}
      >
        <View style={{ flexDirection: "row", gap: 4 }}>
          <View
            style={{
              height: 26,
              paddingHorizontal: 10,
              borderRadius: 13,
              justifyContent: "center",
              backgroundColor: Theme.colors.primaryLight,
            }}
          >
            <AppText bold size={11} color={Theme.colors.primaryDark}>
              4 weeks
            </AppText>
          </View>
          <View
            style={{
              height: 26,
              paddingHorizontal: 10,
              borderRadius: 13,
              justifyContent: "center",
              backgroundColor: Theme.colors.background,
            }}
          >
            <AppText bold size={11} color={Theme.colors.textMuted}>
              This year
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
          <AppText bold size={40} style={{ letterSpacing: -1.2 }}>
            286.4
          </AppText>
          <AppText size={15} color={Theme.colors.textMuted}>
            km
          </AppText>
        </View>
        <AppText size={12} color={Theme.colors.textMuted}>
          9 rides · last 4 weeks
        </AppText>
        <View
          style={{
            height: 52,
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          {SAMPLE_BARS.map((height, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height,
                borderRadius: 4,
                backgroundColor:
                  index === SAMPLE_BARS.length - 1
                    ? Theme.colors.primary
                    : Theme.colors.primaryMuted,
              }}
            />
          ))}
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          left: 0,
          top: 258,
          flexDirection: "row",
          alignItems: "center",
          gap: Theme.space.s,
          paddingVertical: Theme.space.s,
          paddingLeft: Theme.space.s,
          paddingRight: 12,
          borderRadius: 14,
          backgroundColor: Theme.colors.text,
          transform: [{ rotate: "-3deg" }],
          ...cardShadow(0.25, 16),
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: Theme.radius.s,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Theme.colors.primary,
          }}
        >
          <MaterialCommunityIcons
            name="export-variant"
            size={16}
            color={Theme.colors.white}
          />
        </View>
        <AppText bold size={12} color={Theme.colors.white}>
          Share card ready
        </AppText>
      </View>
    </View>
  );
};
