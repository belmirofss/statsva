import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Theme } from "../theme";

type Props = {
  mode?: "local" | "full";
};

export const Loading = ({ mode = "full" }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        height: mode === "full" ? "100%" : "auto",
      }}
    >
      <ActivityIndicator size="large" color={Theme.colors.primary} />
    </View>
  );
};
