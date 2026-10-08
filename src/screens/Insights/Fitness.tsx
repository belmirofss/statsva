import { useMemo } from "react";
import { View } from "react-native";
import moment from "moment";
import { Theme } from "../../theme";
import { historyStart, useActivityHistory } from "../../hooks/useActivityHistory";
import { DetailScreen } from "../../components/layout/DetailScreen";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { LineChart } from "../../components/LineChart";
import {
  FORM_ADVICE,
  FORM_ZONES,
  fitnessSeries,
  formZone,
} from "../../insights/fitness";
import { Legend } from "../../components/Legend";

const DAYS = 90;
const FORM_RANGE = 40;
/** Gauge share per zone, left to right; matches FORM_ZONES. */
const ZONE_WIDTHS = [1, 1.3, 1, 1];
const ZONE_COLORS = ["#3d434c", Theme.colors.primary, Theme.colors.primaryMuted, "#9cc3d6"];

/** Where a form value sits on the gauge, from 0 to 1. */
const gaugePosition = (form: number) => {
  const bounds = [-60, -30, -10, 5, 30];
  const total = ZONE_WIDTHS.reduce((sum, w) => sum + w, 0);
  let offset = 0;
  for (let i = 0; i < ZONE_WIDTHS.length; i++) {
    const [from, to] = [bounds[i], bounds[i + 1]];
    if (form < to || i === ZONE_WIDTHS.length - 1) {
      const within = Math.max(0, Math.min(1, (form - from) / (to - from)));
      return (offset + within * ZONE_WIDTHS[i]) / total;
    }
    offset += ZONE_WIDTHS[i];
  }
  return 1;
};

export const Fitness = () => {
  const history = useActivityHistory();

  const series = useMemo(
    () => history.data && fitnessSeries(history.data, historyStart(), DAYS),
    [history.data]
  );

  const last = series ? series.fitness.length - 1 : 0;
  const fitness = series ? Math.round(series.fitness[last]) : 0;
  const fatigue = series ? Math.round(series.fatigue[last]) : 0;
  const form = fitness - fatigue;
  const zone = formZone(form);
  const fitnessChange = series ? Math.round(series.fitness[last] - series.fitness[Math.max(0, last - 28)]) : 0;
  const signed = (value: number) => `${value > 0 ? "+" : ""}${value}`;

  return (
    <DetailScreen
      title="Fitness & form"
      subtitle={`From Relative Effort · last ${DAYS} days`}
      isLoading={history.isLoading}
      isError={history.isError}
      onRefresh={history.refetch}
    >
      {series && (
        <>
          <Card style={{ marginHorizontal: Theme.gutter, gap: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ gap: 2 }}>
                <AppText size={13} color={Theme.colors.textMuted}>
                  Today's form
                </AppText>
                <AppText bold size={28} style={{ letterSpacing: -0.5 }}>
                  {zone.label}
                </AppText>
              </View>
              <AppText bold size={36} color={Theme.colors.primaryDark}>
                {signed(form)}
              </AppText>
            </View>

            <View
              accessible
              accessibilityLabel={`Form gauge: ${zone.label}, ${signed(form)}`}
              style={{ gap: 6 }}
            >
              <View style={{ height: 12, flexDirection: "row", gap: 3 }}>
                {FORM_ZONES.map((z, index) => (
                  <View
                    key={z.zone}
                    style={{
                      flex: ZONE_WIDTHS[index],
                      backgroundColor: ZONE_COLORS[index],
                      borderTopLeftRadius: index === 0 ? 6 : 0,
                      borderBottomLeftRadius: index === 0 ? 6 : 0,
                      borderTopRightRadius: index === 3 ? 6 : 0,
                      borderBottomRightRadius: index === 3 ? 6 : 0,
                    }}
                  />
                ))}
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    left: `${gaugePosition(form) * 100}%`,
                    marginLeft: -3,
                    width: 6,
                    height: 22,
                    borderRadius: 3,
                    backgroundColor: Theme.colors.text,
                    borderWidth: 1.5,
                    borderColor: Theme.colors.white,
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 3 }}>
                {FORM_ZONES.map((z, index) => (
                  <AppText
                    key={z.zone}
                    size={11}
                    color={Theme.colors.textMuted}
                    numberOfLines={1}
                    style={{ flex: ZONE_WIDTHS[index] }}
                  >
                    {z.zone === "overreaching" ? "Overreach" : z.label}
                  </AppText>
                ))}
              </View>
            </View>

            <AppText style={{ lineHeight: 20 }}>{FORM_ADVICE[zone.zone]}</AppText>
          </Card>

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
              { title: "Fitness", value: fitness, caption: `${signed(fitnessChange)} in 4 wk`, swatch: Theme.colors.primary },
              { title: "Fatigue", value: fatigue, caption: "7-day load", swatch: Theme.colors.text },
              { title: "Form", value: signed(form), caption: "fitness − fatigue", swatch: Theme.colors.primaryMuted },
            ].map((item) => (
              <View
                key={item.title}
                style={{ flex: 1, backgroundColor: Theme.colors.surface, padding: 14, gap: 4 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: item.swatch }} />
                  <AppText size={12} color={Theme.colors.textMuted}>
                    {item.title}
                  </AppText>
                </View>
                <AppText bold size={24}>
                  {item.value}
                </AppText>
                <AppText size={12} color={Theme.colors.textMuted} numberOfLines={1}>
                  {item.caption}
                </AppText>
              </View>
            ))}
          </View>

          <Card style={{ marginHorizontal: Theme.gutter, gap: 10 }}>
            <AppText bold size={16}>
              Last {DAYS} days
            </AppText>
            <View accessible accessibilityLabel="Fitness and fatigue over the last 90 days">
              <LineChart
                height={150}
                series={[
                  { data: series.fatigue, color: Theme.colors.text, strokeWidth: 1.5 },
                  { data: series.fitness, color: Theme.colors.primary, strokeWidth: 3, endDot: true },
                ]}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 18 }}>
              <Legend color={Theme.colors.primary} label="Fitness" />
              <Legend color={Theme.colors.text} label="Fatigue" />
            </View>

            <AppText size={12} color={Theme.colors.textMuted} style={{ marginTop: 6 }}>
              Form
            </AppText>
            <View
              accessible
              accessibilityLabel="Daily form over the last 90 days"
              style={{ height: 60, flexDirection: "row", alignItems: "center", gap: 1 }}
            >
              {series.form.map((value, index) => {
                const height = Math.max(1, (Math.min(FORM_RANGE, Math.abs(value)) / FORM_RANGE) * 29);
                return (
                  <View key={index} style={{ flex: 1, height: 60 }}>
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: value >= 0 ? 30 - height : 30,
                        height,
                        borderRadius: 1,
                        backgroundColor:
                          value >= 5 ? "#9cc3d6" : value < -10 ? Theme.colors.primary : Theme.colors.primaryMuted,
                      }}
                    />
                  </View>
                );
              })}
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 30,
                  height: 1,
                  backgroundColor: Theme.colors.textMuted,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText size={11} color={Theme.colors.textMuted}>
                {moment.utc(series.dates[0]).format("D MMM")}
              </AppText>
              <AppText size={11} color={Theme.colors.textMuted}>
                Today
              </AppText>
            </View>
          </Card>

          <Card style={{ marginHorizontal: Theme.gutter, gap: 8 }}>
            <AppText bold size={16}>
              How it works
            </AppText>
            <AppText size={13} color={Theme.colors.textMuted} style={{ lineHeight: 19 }}>
              Each activity's Relative Effort is its training load. Fitness is your 42-day
              average load, fatigue your 7-day average. Form is the gap between them:
              negative means you are building, positive means you are fresh to race.
            </AppText>
            {series.estimatedCount > 0 && (
              <AppText size={13} color={Theme.colors.textMuted} style={{ lineHeight: 19 }}>
                {series.estimatedCount} of your activities in this window have no Relative
                Effort (usually no heart rate), so their load is estimated from moving time.
              </AppText>
            )}
          </Card>
        </>
      )}
    </DetailScreen>
  );
};
