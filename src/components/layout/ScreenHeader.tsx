import { ReactNode, useRef } from "react";
import { Animated, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../theme";
import { AppText } from "./AppText";

const COMPACT_HEIGHT = 52;

/** Tracks vertical scroll so a compact header can fade in. */
export const useCollapsingHeader = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return { scrollY, onScroll };
};

type LargeHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

/** Top-level screen title, scrolls away with the content. */
export const LargeHeader = ({ title, subtitle, right }: LargeHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: Theme.space.m,
        paddingTop: insets.top + Theme.space.l,
        paddingBottom: Theme.space.m,
        paddingHorizontal: Theme.gutter,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        {subtitle && (
          <AppText size={13} color={Theme.colors.textMuted}>
            {subtitle}
          </AppText>
        )}
        <AppText
          size={30}
          bold
          accessibilityRole="header"
          style={{ letterSpacing: -0.4 }}
        >
          {title}
        </AppText>
      </View>
      {right}
    </View>
  );
};

type CompactHeaderProps = {
  title: string;
  scrollY: Animated.Value;
  showAfter?: number;
};

/** Small title bar pinned to the top once the large header scrolls away. */
export const CompactHeader = ({
  title,
  scrollY,
  showAfter = 64,
}: CompactHeaderProps) => {
  const insets = useSafeAreaInsets();
  const opacity = scrollY.interpolate({
    inputRange: [showAfter - 24, showAfter],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: insets.top + COMPACT_HEIGHT,
        paddingTop: insets.top,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        opacity,
      }}
    >
      <AppText
        size={17}
        bold
        numberOfLines={1}
        style={{ paddingHorizontal: 72 }}
      >
        {title}
      </AppText>
    </Animated.View>
  );
};
