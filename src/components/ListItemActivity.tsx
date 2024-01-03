import { View } from "react-native";
import { List, Text } from "react-native-paper";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { SummaryActivity } from "../types";
import { Theme } from "../theme";
import polyline from "@mapbox/polyline";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = ({ activity }: Props) => {
  const coordinates = polyline
    .decode(activity.map.summary_polyline)
    .map((coordinate) => ({
      latitude: coordinate[0],
      longitude: coordinate[1],
    }));

  return (
    <List.Item
      title={() => (
        <View>
          <Text variant="titleSmall" style={{ fontFamily: Theme.fonts.bold }}>
            {activity.name}
          </Text>
        </View>
      )}
      description={() => (
        <View style={{ marginTop: Theme.space.s }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{
              width: "100%",
              height: 300,
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
            mapType="standard"
          >
            <Polyline
              coordinates={coordinates}
              strokeColor={Theme.colors.primary}
              strokeWidth={6}
            />
          </MapView>
        </View>
      )}
      titleNumberOfLines={2}
      style={{
        backgroundColor: Theme.colors.contrast,
        marginBottom: Theme.space.m,
      }}
    />
  );
};
