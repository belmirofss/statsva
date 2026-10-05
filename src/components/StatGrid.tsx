import { View } from "react-native";
import { TitleAndContent } from "../types";
import { Theme } from "../theme";
import { AppText } from "./layout/AppText";

type Props = {
  items: TitleAndContent[];
  columns?: number;
  /** `tiles`: boxed cells with hairline gaps; `plain`: divided columns. */
  variant?: "plain" | "tiles";
};

export const StatGrid = ({ items, columns = 3, variant = "plain" }: Props) => {
  const visible = items.filter(({ content }) => content !== undefined);
  const rows: TitleAndContent[][] = [];
  for (let i = 0; i < visible.length; i += columns) {
    rows.push(visible.slice(i, i + columns));
  }

  const isTiles = variant === "tiles";

  return (
    <View
      style={
        isTiles
          ? {
              gap: 1,
              backgroundColor: Theme.colors.border,
              borderRadius: Theme.radius.xl,
              overflow: "hidden",
            }
          : { gap: Theme.space.m }
      }
    >
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{ flexDirection: "row", gap: isTiles ? 1 : 0 }}
        >
          {Array.from({ length: columns }, (_, columnIndex) => {
            const item = row[columnIndex];
            const divided = !isTiles && columnIndex > 0 && !!item;

            return (
              <View
                key={columnIndex}
                style={{
                  flex: 1,
                  gap: 4,
                  backgroundColor: isTiles ? Theme.colors.surface : undefined,
                  padding: isTiles ? Theme.space.m : 0,
                  paddingLeft: divided ? 14 : isTiles ? Theme.space.m : 0,
                  borderLeftWidth: divided ? 1 : 0,
                  borderLeftColor: Theme.colors.border,
                }}
              >
                {item && (
                  <>
                    <AppText size={12} color={Theme.colors.textMuted}>
                      {item.title}
                    </AppText>
                    <AppText
                      bold
                      size={isTiles ? 24 : 17}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {item.content}
                    </AppText>
                  </>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
