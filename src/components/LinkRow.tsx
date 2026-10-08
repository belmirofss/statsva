import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../theme";
import { IconName } from "../constants";
import { AppText } from "./layout/AppText";

type LinkRowProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  divided?: boolean;
  onPress: () => void;
};

/** A tappable list row inside a Card: icon, title, optional subtitle, chevron. */
export const LinkRow = ({ icon, title, subtitle, divided, onPress }: LinkRowProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      minHeight: 64,
      paddingVertical: 10,
      borderTopWidth: divided ? 1 : 0,
      borderTopColor: Theme.colors.border,
    }}
  >
    <MaterialCommunityIcons name={icon} size={22} color={Theme.colors.primaryDark} />
    <View style={{ flex: 1, gap: 2 }}>
      <AppText bold size={15} numberOfLines={1}>
        {title}
      </AppText>
      {subtitle && (
        <AppText size={13} color={Theme.colors.textMuted} numberOfLines={1}>
          {subtitle}
        </AppText>
      )}
    </View>
    <MaterialCommunityIcons name="chevron-right" size={20} color={Theme.colors.textMuted} />
  </Pressable>
);
