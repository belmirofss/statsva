import React, { useMemo } from "react";
import { View } from "react-native";

type Props = {
  data: number[];
  color: string;
  height?: number;
  columns?: number;
  /** Scale from the lowest value instead of zero (elevation profiles). */
  fromMin?: boolean;
};

/** A dense column chart for activity streams, built from plain Views. */
export const ColumnChart = React.memo(
  ({ data, color, height = 88, columns = 56, fromMin = false }: Props) => {
    const ratios = useMemo(() => {
      const values = data.filter((value) => Number.isFinite(value));
      if (!values.length) {
        return [];
      }

      const bucketSize = Math.max(1, values.length / columns);
      const buckets: number[] = [];
      for (let start = 0; start < values.length; start += bucketSize) {
        const slice = values.slice(Math.floor(start), Math.floor(start + bucketSize));
        if (slice.length) {
          buckets.push(slice.reduce((sum, v) => sum + v, 0) / slice.length);
        }
      }

      const min = fromMin ? Math.min(...buckets) : 0;
      const range = Math.max(...buckets) - min || 1;
      return buckets.map((value) => 0.06 + 0.94 * ((value - min) / range));
    }, [data, columns, fromMin]);

    return (
      <View
        style={{ height, flexDirection: "row", alignItems: "flex-end", gap: 1 }}
      >
        {ratios.map((ratio, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: `${ratio * 100}%`,
              backgroundColor: color,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
        ))}
      </View>
    );
  }
);
