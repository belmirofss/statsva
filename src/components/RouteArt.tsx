import React, { useMemo } from "react";
import { View } from "react-native";
import * as polylineTool from "@mapbox/polyline";

type Props = {
  polyline: string;
  width: number;
  height: number;
  color: string;
  strokeWidth?: number;
  padding?: number;
  startColor?: string;
};

type Point = [number, number];

function project(
  polyline: string,
  width: number,
  height: number,
  padding: number,
  minStep: number
): Point[] {
  const coordinates = polylineTool.decode(polyline);
  if (coordinates.length < 2) {
    return [];
  }

  // Equirectangular projection, good enough at activity scale.
  const meanLat =
    coordinates.reduce((sum, [lat]) => sum + lat, 0) / coordinates.length;
  const k = Math.cos((meanLat * Math.PI) / 180);
  const raw: Point[] = coordinates.map(([lat, lng]) => [lng * k, -lat]);

  const xs = raw.map(([x]) => x);
  const ys = raw.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX || 1e-9;
  const spanY = Math.max(...ys) - minY || 1e-9;
  const scale = Math.min(
    (width - padding * 2) / spanX,
    (height - padding * 2) / spanY
  );
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;

  const points: Point[] = [];
  raw.forEach(([x, y], index) => {
    const point: Point = [
      offsetX + (x - minX) * scale,
      offsetY + (y - minY) * scale,
    ];
    const last = points[points.length - 1];
    const isLast = index === raw.length - 1;
    if (
      !last ||
      isLast ||
      Math.hypot(point[0] - last[0], point[1] - last[1]) >= minStep
    ) {
      points.push(point);
    }
  });

  return points;
}

/**
 * Draws an encoded polyline as line art with plain Views (each segment is a
 * rotated bar), so it needs no map tiles and captures cleanly in share images.
 */
export const RouteArt = React.memo(
  ({
    polyline,
    width,
    height,
    color,
    strokeWidth = 3,
    padding = 8,
    startColor,
  }: Props) => {
    const points = useMemo(
      () =>
        project(polyline, width, height, padding, Math.max(2, strokeWidth)),
      [polyline, width, height, padding, strokeWidth]
    );

    if (points.length < 2) {
      return <View style={{ width, height }} />;
    }

    const dot = strokeWidth * 2.4;

    return (
      <View style={{ width, height }} pointerEvents="none">
        {points.slice(1).map((end, index) => {
          const start = points[index];
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const length = Math.hypot(dx, dy) + strokeWidth;

          return (
            <View
              key={index}
              style={{
                position: "absolute",
                left: (start[0] + end[0]) / 2 - length / 2,
                top: (start[1] + end[1]) / 2 - strokeWidth / 2,
                width: length,
                height: strokeWidth,
                borderRadius: strokeWidth / 2,
                backgroundColor: color,
                transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
              }}
            />
          );
        })}
        {startColor && (
          <View
            style={{
              position: "absolute",
              left: points[0][0] - dot / 2,
              top: points[0][1] - dot / 2,
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: startColor,
            }}
          />
        )}
      </View>
    );
  }
);
