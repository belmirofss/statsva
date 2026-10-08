import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Theme } from "../theme";

export type LineSeries = {
  data: number[];
  color: string;
  strokeWidth?: number;
  /** Draws a dot on the last point. */
  endDot?: boolean;
};

type Props = {
  series: LineSeries[];
  /** Slots along the x axis; shorter series stop early. Defaults to the longest. */
  length?: number;
  height?: number;
  min?: number;
  max?: number;
  gridLines?: number;
  /** Draws a vertical guide at this x index. */
  markerIndex?: number;
  /** Draws a horizontal reference line at this value. */
  baseline?: number;
};

type Point = [number, number];

/** Keeps segment count low so long series stay cheap to render. */
const MAX_POINTS = 90;

const Segment = ({
  start,
  end,
  color,
  width,
}: {
  start: Point;
  end: Point;
  color: string;
  width: number;
}) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy) + width;

  return (
    <View
      style={{
        position: "absolute",
        left: (start[0] + end[0]) / 2 - length / 2,
        top: (start[1] + end[1]) / 2 - width / 2,
        width: length,
        height: width,
        borderRadius: width / 2,
        backgroundColor: color,
        transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
      }}
    />
  );
};

/** A line chart drawn with plain Views, like `RouteArt`, so no SVG dependency. */
export const LineChart = React.memo(
  ({
    series,
    length,
    height = 160,
    min,
    max,
    gridLines = 3,
    markerIndex,
    baseline,
  }: Props) => {
    const [width, setWidth] = useState(0);
    const slots = length ?? Math.max(...series.map((s) => s.data.length));

    const { lines, low, high } = useMemo(() => {
      const values = series.flatMap((s) => s.data);
      const low = min ?? Math.min(0, ...values);
      const high = max ?? (Math.max(...values, low + 1) - low) * 1.08 + low;
      const step = Math.max(1, Math.ceil(slots / MAX_POINTS));
      const x = (index: number) => (width * index) / Math.max(1, slots - 1);
      const y = (value: number) =>
        height - ((value - low) / (high - low || 1)) * height;

      const lines = series.map((s) => {
        const points: Point[] = [];
        s.data.forEach((value, index) => {
          if (index % step === 0 || index === s.data.length - 1) {
            points.push([x(index), y(value)]);
          }
        });
        return points;
      });

      return { lines, low, high };
    }, [series, slots, width, height, min, max]);

    const yOf = (value: number) =>
      height - ((value - low) / (high - low || 1)) * height;

    return (
      <View
        style={{ height }}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        pointerEvents="none"
      >
        {Array.from({ length: gridLines }, (_, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (height * index) / Math.max(1, gridLines - 1),
              height: 1,
              backgroundColor: Theme.colors.border,
              opacity: 0.6,
            }}
          />
        ))}
        {baseline !== undefined && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: yOf(baseline),
              height: 1,
              backgroundColor: Theme.colors.textMuted,
            }}
          />
        )}
        {markerIndex !== undefined && width > 0 && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: (width * markerIndex) / Math.max(1, slots - 1),
              width: 1,
              backgroundColor: Theme.colors.text,
              opacity: 0.35,
            }}
          />
        )}
        {width > 0 &&
          lines.map((points, seriesIndex) => {
            const { color, strokeWidth = 2.5, endDot } = series[seriesIndex];
            const last = points[points.length - 1];
            const dot = strokeWidth * 3.4;

            return (
              <React.Fragment key={seriesIndex}>
                {points.slice(1).map((end, index) => (
                  <Segment
                    key={index}
                    start={points[index]}
                    end={end}
                    color={color}
                    width={strokeWidth}
                  />
                ))}
                {endDot && last && (
                  <View
                    style={{
                      position: "absolute",
                      left: last[0] - dot / 2,
                      top: last[1] - dot / 2,
                      width: dot,
                      height: dot,
                      borderRadius: dot / 2,
                      backgroundColor: color,
                      borderWidth: 2,
                      borderColor: Theme.colors.surface,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
      </View>
    );
  }
);
