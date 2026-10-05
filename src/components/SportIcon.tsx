import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SportType } from "../types";
import { SPORT_TYPE_TO_ICON } from "../constants";
import { Theme } from "../theme";

type Props = {
  sportType: SportType;
  size?: number;
};

export const SportIcon = ({ sportType, size = 28 }: Props) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: Theme.colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons
        name={SPORT_TYPE_TO_ICON[sportType] ?? "star"}
        size={size * 0.62}
        color={Theme.colors.primaryDark}
      />
    </View>
  );
};
