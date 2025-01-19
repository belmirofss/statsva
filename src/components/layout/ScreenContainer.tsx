import { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Theme } from "../../theme";

type ViewStyleProp = StyleProp<ViewStyle>;

type Props = {
  children: ReactNode;
  style?: ViewStyleProp;
  disableScrollView?: boolean;
};

export const ScreenContainer = ({
  children,
  style = {},
  disableScrollView,
}: Props) => {
  const containerStyle = StyleSheet.compose(
    {
      flex: 1,
      padding: Theme.space.m,
      backgroundColor: Theme.colors.lightGray,
    },
    style
  );

  const renderView = () => <View style={containerStyle}>{children}</View>;

  if (disableScrollView) {
    return renderView();
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {renderView()}
    </ScrollView>
  );
};
