import { Image, Pressable, View } from "react-native";
import { SummaryAthlete } from "../types";
import { Theme } from "../theme";
import { AppText } from "./layout/AppText";

type Props = {
  athlete?: SummaryAthlete;
  size?: number;
  onPress?: () => void;
};

export const Avatar = ({ athlete, size = 44, onPress }: Props) => {
  // Strava sends a relative placeholder path when there is no photo.
  const source = size > 62 ? athlete?.profile : athlete?.profile_medium;
  const photo = source?.startsWith("http") ? source : undefined;
  const initials = [athlete?.firstname, athlete?.lastname]
    .map((name) => name?.trim()[0] ?? "")
    .join("")
    .toUpperCase();

  const content = photo ? (
    <Image
      source={{ uri: photo }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: Theme.colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText bold size={size * 0.34} color={Theme.colors.primaryDark}>
        {initials}
      </AppText>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      hitSlop={8}
    >
      {content}
    </Pressable>
  );
};
