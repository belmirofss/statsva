import { View } from "react-native";
import { TitleAndContent } from "../types";
import { Theme } from "../theme";
import { AppText } from "./layout/AppText";
import { Card } from "./layout/Card";

type Props = {
  items: TitleAndContent[];
};

/** Label/value rows; items without a value are left out. */
export const DetailList = ({ items }: Props) => {
  const visible = items.filter(({ content }) => content !== undefined);

  if (!visible.length) {
    return null;
  }

  return (
    <Card style={{ paddingVertical: Theme.space.xs }}>
      {visible.map(({ title, content }, index) => (
        <View
          key={title}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: Theme.space.m,
            minHeight: 48,
            borderTopWidth: index ? 1 : 0,
            borderTopColor: Theme.colors.border,
          }}
        >
          <AppText color={Theme.colors.textMuted}>{title}</AppText>
          <AppText bold style={{ flexShrink: 1, textAlign: "right" }}>
            {content}
          </AppText>
        </View>
      ))}
    </Card>
  );
};
