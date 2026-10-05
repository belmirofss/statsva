import MapView, {
  EdgePadding,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import * as polylineTool from "@mapbox/polyline";
import { Theme } from "../theme";
import { View } from "react-native";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { QUIET_MAP_STYLE } from "../mapStyle";
import { AppText } from "./layout/AppText";

const DEFAULT_PADDING: EdgePadding = { top: 24, right: 24, bottom: 24, left: 24 };
/** Start and end closer than this read as a loop: no separate finish marker. */
const LOOP_THRESHOLD_METERS = 100;
const KM_MARKER_STEPS = [1, 2, 5, 10, 20, 50, 100];
const MAX_KM_MARKERS = 8;

type Props = {
  polyline: string;
  /** Defaults to a square map as wide as its container. */
  height?: number;
  satellite?: boolean;
  showKmMarkers?: boolean;
  edgePadding?: EdgePadding;
};

function distanceMeters(a: LatLng, b: LatLng) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

/** A marker per N km, with N chosen so the route gets at most a handful. */
function kmMarkers(coordinates: LatLng[]) {
  const cumulative = [0];
  for (let i = 1; i < coordinates.length; i++) {
    cumulative.push(
      cumulative[i - 1] + distanceMeters(coordinates[i - 1], coordinates[i])
    );
  }

  const totalKm = cumulative[cumulative.length - 1] / 1000;
  const step = KM_MARKER_STEPS.find((s) => totalKm / s <= MAX_KM_MARKERS);
  if (!step || totalKm < step * 1.5) {
    return [];
  }

  const markers: { km: number; coordinate: LatLng }[] = [];
  let next = step;
  cumulative.forEach((meters, index) => {
    if (meters / 1000 >= next && next < totalKm - step / 2) {
      markers.push({ km: next, coordinate: coordinates[index] });
      next += step;
    }
  });
  return markers;
}

/**
 * Custom marker views must be drawn once before tracking stops, or Android
 * renders them blank.
 */
const RouteMarker = ({
  coordinate,
  children,
}: {
  coordinate: LatLng;
  children: ReactNode;
}) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setTracksViewChanges(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracksViewChanges}
      tappable={false}
    >
      {children}
    </Marker>
  );
};

const dotStyle = {
  width: 22,
  height: 22,
  borderRadius: 11,
  borderWidth: 4,
  borderColor: Theme.colors.white,
  overflow: "hidden" as const,
};

const StartDot = () => (
  <View style={{ padding: 2 }}>
    <View style={{ ...dotStyle, backgroundColor: Theme.colors.text }} />
  </View>
);

const FinishDot = () => (
  <View style={{ padding: 2 }}>
    <View style={{ ...dotStyle, flexDirection: "row", flexWrap: "wrap" }}>
      {[0, 1, 2, 3].map((square) => (
        <View
          key={square}
          style={{
            width: 7,
            height: 7,
            backgroundColor:
              square === 0 || square === 3 ? Theme.colors.text : Theme.colors.white,
          }}
        />
      ))}
    </View>
  </View>
);

const KmLabel = ({ km }: { km: number }) => (
  <View
    style={{
      height: 20,
      minWidth: 20,
      paddingHorizontal: 6,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: Theme.colors.primary,
      backgroundColor: Theme.colors.white,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <AppText bold size={11} color={Theme.colors.primaryDark}>
      {km}
    </AppText>
  </View>
);

export const Map = ({
  polyline,
  height,
  satellite = false,
  showKmMarkers = false,
  edgePadding = DEFAULT_PADDING,
}: Props) => {
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

  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];
  const isLoop =
    !start || !end || distanceMeters(start, end) < LOOP_THRESHOLD_METERS;
  const markers = useMemo(
    () => (showKmMarkers ? kmMarkers(coordinates) : []),
    [coordinates, showKmMarkers]
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
            mapType={satellite ? "satellite" : "standard"}
            customMapStyle={QUIET_MAP_STYLE}
            onMapLoaded={() => {
              if (map.current) {
                map.current.fitToCoordinates(coordinates, {
                  edgePadding,
                  animated: false,
                });
              }
            }}
          >
            <Polyline
              coordinates={coordinates}
              strokeColor={Theme.colors.white}
              strokeWidth={9}
              lineCap="round"
              lineJoin="round"
              zIndex={1}
            />
            <Polyline
              coordinates={coordinates}
              strokeColor={Theme.colors.primary}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
              zIndex={2}
            />
            {markers.map((marker) => (
              <RouteMarker key={marker.km} coordinate={marker.coordinate}>
                <KmLabel km={marker.km} />
              </RouteMarker>
            ))}
            {!isLoop && end && (
              <RouteMarker coordinate={end}>
                <FinishDot />
              </RouteMarker>
            )}
            {start && (
              <RouteMarker coordinate={start}>
                <StartDot />
              </RouteMarker>
            )}
          </MapView>
        </View>
      )}
    </View>
  );
};
