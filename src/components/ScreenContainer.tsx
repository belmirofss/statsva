import { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Theme } from "../theme";

type ViewStyleProp = StyleProp<ViewStyle>;

type Props = {
  children: ReactNode;
  style?: ViewStyleProp;
};

export const ScreenContainer = ({ children, style = {} }: Props) => {
  const containerStyle = StyleSheet.compose(
    {
      flex: 1,
      padding: Theme.space.m,
    },
    style
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={containerStyle}>{children}</View>
    </ScrollView>
  );
};
