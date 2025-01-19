import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as polylineTool from "@mapbox/polyline";
import { Theme } from "../theme";
import { View } from "react-native";
import { useMemo, useRef, useState } from "react";
import { CUSTOM_MAP_STYLE } from "../mapStyle";

type Props = {
  polyline: string;
};

export const Map = ({ polyline }: Props) => {
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
            minHeight: viewSize,
            backgroundColor: Theme.colors.gray,
          }}
        >
          <MapView
            ref={map}
            provider={PROVIDER_GOOGLE}
            style={{
              width: viewSize,
              height: viewSize,
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
                  edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
                  animated: false,
                });
              }
            }}
            customMapStyle={CUSTOM_MAP_STYLE}
          >
            <Polyline
              coordinates={coordinates}
              strokeColor={Theme.colors.primary}
              strokeWidth={2}
            />
          </MapView>
        </View>
      )}
    </View>
  );
};
