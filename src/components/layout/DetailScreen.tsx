import { ReactNode, useState } from "react";
import { Animated, Pressable, RefreshControl, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../theme";
import { IconName } from "../../constants";
import { AppText } from "./AppText";
import { CompactHeader, useCollapsingHeader } from "./ScreenHeader";
import { Loading } from "./Loading";
import { Error } from "./Error";

const BACK_ROW = 52;

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => Promise<unknown>;
  /** Pinned under the content, e.g. a share bar. */
  footer?: ReactNode;
};

/**
 * A pushed screen with a back button, a large title that scrolls away and a
 * compact title that fades in, matching the tab screens.
 */
export const DetailScreen = ({
  title,
  subtitle,
  children,
  isLoading,
  isError,
  onRefresh,
  footer,
}: Props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useCollapsingHeader();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh().catch(() => {});
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          gap: Theme.space.m,
          paddingBottom: Theme.space.xl + (footer ? 84 + insets.bottom : 0),
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              colors={[Theme.colors.primary]}
              tintColor={Theme.colors.primary}
              progressViewOffset={insets.top}
            />
          ) : undefined
        }
      >
        <View
          style={{
            paddingTop: insets.top + BACK_ROW,
            paddingHorizontal: Theme.gutter,
            gap: 2,
          }}
        >
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

        {isLoading && <Loading mode="local" />}
        {isError && <Error />}
        {!isLoading && !isError && children}
      </Animated.ScrollView>

      <CompactHeader title={title} scrollY={scrollY} showAfter={BACK_ROW + 40} />

      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={4}
        style={{
          position: "absolute",
          top: insets.top + 4,
          left: 8,
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={30}
          color={Theme.colors.text}
        />
      </Pressable>

      {footer && (
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
          {footer}
        </View>
      )}
    </View>
  );
};

type PrimaryButtonProps = {
  label: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
};

/** The filled button used for the main action of a screen. */
export const PrimaryButton = ({
  label,
  icon,
  onPress,
  disabled,
}: PrimaryButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    style={({ pressed }) => ({
      height: 52,
      borderRadius: Theme.radius.l,
      backgroundColor: Theme.colors.primaryDark,
      opacity: pressed || disabled ? 0.85 : 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Theme.space.s,
    })}
  >
    {icon && (
      <MaterialCommunityIcons name={icon} size={20} color={Theme.colors.white} />
    )}
    <AppText bold size={16} color={Theme.colors.white}>
      {label}
    </AppText>
  </Pressable>
);
