import { Pressable, View } from "react-native";
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
  trackColor?: string;
};

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  trackColor = Theme.colors.control,
}: Props<T>) => {
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        gap: Theme.space.xs,
        padding: Theme.space.xs,
        borderRadius: 14,
        backgroundColor: trackColor,
      }}
    >
      {options.map((option) => {
        const active = option.value === value;
        const color = active ? Theme.colors.text : Theme.colors.textMuted;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              height: 44,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderRadius: 10,
              backgroundColor: active ? Theme.colors.surface : "transparent",
              ...(active && {
                elevation: 1,
                shadowColor: Theme.colors.text,
                shadowOpacity: 0.12,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
              }),
            }}
          >
            {option.icon && (
              <MaterialCommunityIcons name={option.icon} size={20} color={color} />
            )}
            <AppText bold size={15} color={color}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
