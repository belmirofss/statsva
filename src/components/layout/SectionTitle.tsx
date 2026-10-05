import { ReactNode } from "react";
import { View } from "react-native";
import { Theme } from "../../theme";
import { AppText } from "./AppText";

type Props = {
  title: string;
  right?: ReactNode;
  /** Adds the screen gutter; turn off inside already padded content. */
  inset?: boolean;
};

export const SectionTitle = ({ title, right, inset = true }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
        paddingHorizontal: inset ? Theme.gutter : 0,
        marginTop: Theme.space.s,
      }}
    >
      <AppText size={18} bold accessibilityRole="header">
        {title}
      </AppText>
      {right}
    </View>
  );
};
