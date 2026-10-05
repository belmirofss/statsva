import { ReactNode } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { Theme } from "../../theme";

type Props = ViewProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ children, style, ...props }: Props) => {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: Theme.colors.surface,
          borderRadius: Theme.radius.xl,
          padding: Theme.space.m,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
