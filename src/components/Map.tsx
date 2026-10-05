import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as polylineTool from "@mapbox/polyline";
import { Theme } from "../theme";
import { View } from "react-native";
import { useMemo, useRef, useState } from "react";
import { CUSTOM_MAP_STYLE } from "../mapStyle";

type Props = {
  polyline: string;
  /** Defaults to a square map as wide as its container. */
  height?: number;
};

export const Map = ({ polyline, height }: Props) => {
  const map = useRef<MapView>(null);

  const [viewSize, setViewSize] = useState(0);

  const coordinates = useMemo(
    () =>
      polylineTool.decode(polyline).map((coordinate) => ({
        latitude: coordinate[0],
        longitude: coordinate[1],
      })),
    [polyline]
  );

  return (
    <View
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setViewSize(width);
      }}
    >
      {!!viewSize && (
        <View
          style={{
            width: viewSize,
            minHeight: height ?? viewSize,
            backgroundColor: Theme.colors.mapTint,
          }}
        >
          <MapView
            ref={map}
            provider={PROVIDER_GOOGLE}
            style={{
              width: viewSize,
              height: height ?? viewSize,
            }}
            showsMyLocationButton={false}
            showsPointsOfInterest={false}
            showsCompass={false}
            showsScale={false}
            showsIndoors={false}
            zoomEnabled={false}
            zoomTapEnabled={false}
            zoomControlEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            scrollDuringRotateOrZoomEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            mapType="hybrid"
            onMapLoaded={() => {
              if (map.current) {
                map.current.fitToCoordinates(coordinates, {
                  edgePadding: { top: 24, right: 24, bottom: 24, left: 24 },
                  animated: false,
                });
              }
            }}
            customMapStyle={CUSTOM_MAP_STYLE}
          >
            <Polyline
              coordinates={coordinates}
              strokeColor={Theme.colors.primary}
              strokeWidth={3}
            />
          </MapView>
        </View>
      )}
    </View>
  );
};
