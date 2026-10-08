import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as polylineTool from "@mapbox/polyline";
import { Theme } from "../../theme";
import { formatNumber } from "../../helpers";
import { QUIET_MAP_STYLE } from "../../mapStyle";
import { useActivityHistory } from "../../hooks/useActivityHistory";
import { usePlaces } from "../../hooks/usePlaces";
import { DetailScreen, PrimaryButton } from "../../components/layout/DetailScreen";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { ChipGroup } from "../../components/ChipGroup";
import { ShareSheet } from "../../components/share/ShareSheet";
import { Loading } from "../../components/layout/Loading";

const MAP_HEIGHT = 360;
/** Drawing hundreds of polylines gets slow; the most recent ones are plenty. */
const MAX_ROUTES = 300;
/** Start points within ~50 km count as the same home area. */
const AREA_GRID = 2;

type Route = {
  id: number;
  coordinates: LatLng[];
  area: string;
};

/** Thins a route to every Nth point; plenty for an overview map. */
const decode = (encoded: string) => {
  const points = polylineTool.decode(encoded);
  const step = Math.max(1, Math.floor(points.length / 120));
  return points
    .filter((_, index) => index % step === 0 || index === points.length - 1)
    .map(([latitude, longitude]) => ({ latitude, longitude }));
};

export const Explorer = () => {
  const map = useRef<MapView>(null);
  const history = useActivityHistory();
  const thisYear = moment().year();
  const [year, setYear] = useState(String(thisYear));
  const [isShareOpen, setIsShareOpen] = useState(false);

  const inYear = useMemo(
    () => (history.data ?? []).filter((a) => a.start_date_local.startsWith(year)),
    [history.data, year]
  );
  const places = usePlaces(history.data ? inYear : undefined);

  const { routes, focus } = useMemo(() => {
    const routes: Route[] = inYear
      .filter((a) => a.map?.summary_polyline)
      .slice(0, MAX_ROUTES)
      .map((a) => ({
        id: a.id,
        coordinates: decode(a.map!.summary_polyline),
        area: a.start_latlng?.length
          ? `${Math.round(a.start_latlng[0] * AREA_GRID)},${Math.round(a.start_latlng[1] * AREA_GRID)}`
          : "",
      }))
      .filter((route) => route.coordinates.length > 1);

    // Fit the map to where most routes are, not to every trip abroad.
    const counts = new Map<string, number>();
    routes.forEach((r) => counts.set(r.area, (counts.get(r.area) ?? 0) + 1));
    const home = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const focus = routes
      .filter((r) => r.area === home)
      .flatMap((r) => r.coordinates.filter((_, i) => i % 10 === 0));

    return { routes, focus };
  }, [inYear]);

  const countries = places.data ?? [];
  const cityCount = countries.reduce((sum, c) => sum + c.cities.length, 0);
  const years = [String(thisYear), String(thisYear - 1)];

  return (
    <DetailScreen
      title="Explorer"
      subtitle={`Every route of ${year}`}
      isLoading={history.isLoading}
      isError={history.isError}
      onRefresh={history.refetch}
    >
      <ChipGroup
        scrollable
        variant="solid"
        value={year}
        onChange={setYear}
        options={years.map((value) => ({ value, label: value }))}
      />

      <View
        style={{
          marginHorizontal: Theme.gutter,
          height: MAP_HEIGHT,
          borderRadius: Theme.radius.xl,
          overflow: "hidden",
          backgroundColor: Theme.colors.mapTint,
        }}
        accessible
        accessibilityLabel={`Map of ${routes.length} routes from ${year}`}
      >
        {routes.length > 0 ? (
          <MapView
            key={year}
            ref={map}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            customMapStyle={QUIET_MAP_STYLE}
            showsPointsOfInterest={false}
            showsCompass={false}
            showsIndoors={false}
            toolbarEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            onMapLoaded={() =>
              map.current?.fitToCoordinates(focus, {
                edgePadding: { top: 32, right: 32, bottom: 32, left: 32 },
                animated: false,
              })
            }
          >
            {routes.map((route) => (
              <Polyline
                key={route.id}
                coordinates={route.coordinates}
                strokeColor="rgba(252,76,2,0.45)"
                strokeWidth={2.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </MapView>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: Theme.gutter }}>
            <AppText color={Theme.colors.textMuted} style={{ textAlign: "center" }}>
              No GPS routes in {year} yet.
            </AppText>
          </View>
        )}
      </View>

      <View
        style={{
          marginHorizontal: Theme.gutter,
          flexDirection: "row",
          gap: 1,
          backgroundColor: Theme.colors.border,
          borderRadius: Theme.radius.xl,
          overflow: "hidden",
        }}
      >
        {[
          { title: "Routes", value: formatNumber(routes.length) },
          { title: "Countries", value: places.isLoading ? "…" : formatNumber(countries.length) },
          { title: "Cities", value: places.isLoading ? "…" : formatNumber(cityCount) },
        ].map((item) => (
          <View key={item.title} style={{ flex: 1, backgroundColor: Theme.colors.surface, padding: 14, gap: 4 }}>
            <AppText size={12} color={Theme.colors.textMuted}>
              {item.title}
            </AppText>
            <AppText bold size={22}>
              {item.value}
            </AppText>
          </View>
        ))}
      </View>

      {places.isLoading && <Loading mode="local" />}
      {countries.length > 0 && (
        <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: Theme.space.xs }}>
          {countries.map((visit, index) => (
            <View
              key={visit.country}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                minHeight: 60,
                borderTopWidth: index ? 1 : 0,
                borderTopColor: Theme.colors.border,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: Theme.colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText bold size={12} color={Theme.colors.textMuted}>
                  {visit.countryCode}
                </AppText>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText bold size={15}>
                  {visit.country}
                </AppText>
                {!!visit.cities.length && (
                  <AppText size={12} color={Theme.colors.textMuted} numberOfLines={1}>
                    {visit.cities.slice(0, 3).join(", ")}
                    {visit.cities.length > 3 ? ` + ${visit.cities.length - 3} more` : ""}
                  </AppText>
                )}
              </View>
              <AppText bold>{formatNumber(visit.count)}</AppText>
            </View>
          ))}
        </Card>
      )}

      {routes.length > 0 && (
        <View style={{ paddingHorizontal: Theme.gutter }}>
          <PrimaryButton
            label="Make a route poster"
            icon="view-grid-outline"
            onPress={() => setIsShareOpen(true)}
          />
        </View>
      )}

      <ShareSheet
        visible={isShareOpen}
        onDismiss={() => setIsShareOpen(false)}
        fileName={`Stats-va - Routes ${year}`}
        content={{
          eyebrow: `My ${year} routes`,
          eyebrowRight: `${formatNumber(routes.length)} routes`,
          routes: inYear
            .filter((a) => a.map?.summary_polyline)
            .slice(0, 36)
            .map((a) => a.map!.summary_polyline),
          stats: [
            { title: "Routes", content: formatNumber(routes.length) },
            { title: "Countries", content: countries.length ? formatNumber(countries.length) : undefined },
            { title: "Cities", content: cityCount ? formatNumber(cityCount) : undefined },
          ],
        }}
      />
    </DetailScreen>
  );
};
