import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Theme } from "../../theme";

type Props = {
  mode?: "local" | "full";
};

export const Loading = ({ mode = "full" }: Props) => {
  const isFull = mode === "full";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: isFull ? "100%" : "auto",
        padding: Theme.space.m,
        backgroundColor: "transparent",
      }}
    >
      <ActivityIndicator
        size={isFull ? "large" : "small"}
        color={Theme.colors.primary}
      />
    </View>
  );
};
