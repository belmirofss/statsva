import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../theme";
import { IconName } from "../constants";
import { AppText } from "./layout/AppText";

type Option<T> = {
  value: T;
  label: string;
  icon?: IconName;
};

type Props<T> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** `tint` for compact in-card toggles, `solid` for list filters. */
  variant?: "tint" | "solid";
  scrollable?: boolean;
};

export const ChipGroup = <T extends string>({
  options,
  value,
  onChange,
  variant = "tint",
  scrollable = false,
}: Props<T>) => {
  const isSolid = variant === "solid";

  const chips = options.map((option) => {
    const active = option.value === value;

    let backgroundColor: string = Theme.colors.background;
    let color: string = Theme.colors.textMuted;
    if (isSolid) {
      backgroundColor = active ? Theme.colors.text : Theme.colors.surface;
      color = active ? Theme.colors.white : Theme.colors.text;
    } else if (active) {
      backgroundColor = Theme.colors.primaryLight;
      color = Theme.colors.primaryDark;
    }

    return (
      <Pressable
        key={option.value}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        onPress={() => onChange(option.value)}
        hitSlop={isSolid ? 2 : 6}
        style={{
          height: isSolid ? 40 : 32,
          paddingHorizontal: isSolid ? 14 : 12,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor,
          borderWidth: isSolid && !active ? 1 : 0,
          borderColor: Theme.colors.border,
        }}
      >
        {option.icon && (
          <MaterialCommunityIcons name={option.icon} size={18} color={color} />
        )}
        <AppText bold size={isSolid ? 14 : 13} color={color}>
          {option.label}
        </AppText>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: Theme.space.s,
          paddingHorizontal: Theme.gutter,
        }}
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View style={{ flexDirection: "row", gap: Theme.space.xs }}>{chips}</View>
  );
};
