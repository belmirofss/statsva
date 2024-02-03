import React from "react";
import { View } from "react-native";
import { Theme } from "../../theme";
import { Text } from "react-native-paper";

export const Error = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Text
        variant="titleMedium"
        style={{
          textAlign: "center",
          color: Theme.colors.dark,
          fontFamily: Theme.fonts.bold,
        }}
      >
        Somenthing went wrong! Try again later.
      </Text>
    </View>
  );
};
