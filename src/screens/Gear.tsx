import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../theme";
import { formatActivityDate, formatNumber } from "../helpers";
import { useActivityHistory, historyStart } from "../hooks/useActivityHistory";
import {
  GearItem,
  SHOE_LIMIT_OPTIONS_KM,
  SHOE_WARNING_KM,
  useGear,
  useShoeLimits,
} from "../hooks/useGear";
import { DetailScreen } from "../components/layout/DetailScreen";
import { Card } from "../components/layout/Card";
import { AppText } from "../components/layout/AppText";
import { SectionTitle } from "../components/layout/SectionTitle";
import { Loading } from "../components/layout/Loading";

/** The limit sits at 75% of the bar, so going past it stays visible. */
const LIMIT_AT = 0.75;

const nextLimit = (current: number) => {
  const index = SHOE_LIMIT_OPTIONS_KM.indexOf(current);
  return SHOE_LIMIT_OPTIONS_KM[(index + 1) % SHOE_LIMIT_OPTIONS_KM.length];
};

const GearIcon = ({ kind }: { kind: GearItem["kind"] }) => (
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: Theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <MaterialCommunityIcons
      name={kind === "bike" ? "bike" : "shoe-sneaker"}
      size={22}
      color={Theme.colors.textMuted}
    />
  </View>
);

export const Gear = () => {
  const history = useActivityHistory();
  const gear = useGear(history.data);
  const { limitFor, setLimit } = useShoeLimits();

  const shoes = gear.items.filter((item) => item.kind === "shoe");
  const bikes = gear.items.filter((item) => item.kind === "bike");
  const worn = shoes
    .filter((shoe) => shoe.distance / 1000 >= limitFor(shoe.id) - SHOE_WARNING_KM)
    .sort((a, b) => b.distance - a.distance)[0];

  const usage = (item: GearItem) =>
    `${formatNumber(item.count)} ${item.kind === "bike" ? "rides" : "uses"} since ${historyStart().year()} · last ${formatActivityDate(item.lastUsed)}`;

  return (
    <DetailScreen
      title="Gear"
      subtitle="Profile"
      isLoading={history.isLoading}
      isError={history.isError}
      onRefresh={history.refetch}
    >
      {gear.isLoading && <Loading mode="local" />}

      {worn && (
        <Card
          style={{
            marginHorizontal: Theme.gutter,
            backgroundColor: Theme.colors.text,
            flexDirection: "row",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: Theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="alert-outline" size={22} color={Theme.colors.white} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText bold size={15} color={Theme.colors.white}>
              Time for new shoes?
            </AppText>
            <AppText size={13} color="#e3e5e8" style={{ lineHeight: 19 }}>
              Your {worn.name} have {formatNumber(worn.distance / 1000)} km. Most running
              shoes lose their cushioning somewhere between 500 and 800 km.
            </AppText>
          </View>
        </Card>
      )}

      {!gear.isLoading && !gear.items.length && (
        <AppText color={Theme.colors.textMuted} style={{ paddingHorizontal: Theme.gutter, lineHeight: 20 }}>
          None of your activities since {historyStart().year()} have gear set. Add your
          shoes and bikes in Strava and pick them when you save an activity.
        </AppText>
      )}

      {shoes.length > 0 && (
        <View>
          <SectionTitle title="Shoes" />
          <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: Theme.space.xs }}>
            {shoes.map((shoe, index) => {
              const km = shoe.distance / 1000;
              const limit = limitFor(shoe.id);
              const warn = km >= limit - SHOE_WARNING_KM;
              const ratio = Math.min(1, (km / limit) * LIMIT_AT);

              return (
                <View
                  key={shoe.id}
                  style={{
                    paddingVertical: 14,
                    gap: 10,
                    borderTopWidth: index ? 1 : 0,
                    borderTopColor: Theme.colors.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <GearIcon kind="shoe" />
                    <View style={{ flex: 1, gap: 2 }}>
                      <AppText bold size={15} numberOfLines={1}>
                        {shoe.name}
                      </AppText>
                      <AppText size={12} color={Theme.colors.textMuted} numberOfLines={1}>
                        {usage(shoe)}
                      </AppText>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 2 }}>
                      <AppText bold size={17}>
                        {formatNumber(km)} km
                      </AppText>
                      <AppText bold size={12} color={warn ? Theme.colors.primaryDark : Theme.colors.textMuted}>
                        {km >= limit
                          ? "Past your limit"
                          : warn
                          ? "Replace soon"
                          : `${formatNumber(limit - km)} km left`}
                      </AppText>
                    </View>
                  </View>
                  <View
                    accessible
                    accessibilityLabel={`${formatNumber(km)} of ${limit} kilometres`}
                    style={{ height: 8, borderRadius: 4, backgroundColor: Theme.colors.control }}
                  >
                    <View
                      style={{
                        height: 8,
                        width: `${ratio * 100}%`,
                        borderRadius: 4,
                        backgroundColor: warn ? Theme.colors.primary : "#fd8a57",
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: -3,
                        left: `${LIMIT_AT * 100}%`,
                        width: 2,
                        height: 14,
                        backgroundColor: Theme.colors.text,
                        opacity: 0.35,
                      }}
                    />
                  </View>
                  <Pressable
                    onPress={() => setLimit(shoe.id, nextLimit(limit))}
                    accessibilityRole="button"
                    accessibilityLabel={`Retire at ${limit} kilometres. Tap to change.`}
                    hitSlop={8}
                    style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, minHeight: 32 }}
                  >
                    <MaterialCommunityIcons name="flag-checkered" size={16} color={Theme.colors.primaryDark} />
                    <AppText bold size={13} color={Theme.colors.primaryDark}>
                      Retire at {formatNumber(limit)} km
                    </AppText>
                  </Pressable>
                </View>
              );
            })}
          </Card>
        </View>
      )}

      {bikes.length > 0 && (
        <View>
          <SectionTitle title="Bikes" />
          <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: Theme.space.xs }}>
            {bikes.map((bike, index) => (
              <View
                key={bike.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  minHeight: 68,
                  borderTopWidth: index ? 1 : 0,
                  borderTopColor: Theme.colors.border,
                }}
              >
                <GearIcon kind="bike" />
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText bold size={15} numberOfLines={1}>
                    {bike.name}
                  </AppText>
                  <AppText size={12} color={Theme.colors.textMuted} numberOfLines={1}>
                    {usage(bike)}
                  </AppText>
                </View>
                <AppText bold size={17}>
                  {formatNumber(bike.distance / 1000)} km
                </AppText>
              </View>
            ))}
          </Card>
        </View>
      )}

      {gear.items.length > 0 && (
        <AppText size={12} color={Theme.colors.textMuted} style={{ paddingHorizontal: Theme.gutter, lineHeight: 18 }}>
          Distances are lifetime totals from Strava. Retire-at limits are saved on this
          device.
        </AppText>
      )}
    </DetailScreen>
  );
};
