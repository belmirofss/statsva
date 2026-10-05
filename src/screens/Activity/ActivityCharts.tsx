import { View } from "react-native";
import { ActivityStreams } from "../../types";
import { Theme } from "../../theme";
import { formatDistance, formatNumber } from "../../helpers";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { ColumnChart } from "../../components/ColumnChart";

type ChartConfig = {
  title: string;
  data?: number[];
  color: string;
  fromMin?: boolean;
  caption: (values: number[]) => string;
};

const average = (values: number[]) =>
  values.reduce((sum, v) => sum + v, 0) / values.length;

type Props = {
  streams: ActivityStreams;
};

export const ActivityCharts = ({ streams }: Props) => {
  const distances = streams.distance?.data ?? [];
  const totalDistance = distances[distances.length - 1];

  const charts: ChartConfig[] = [
    {
      title: "Elevation",
      data: streams.altitude?.data,
      color: Theme.colors.primary,
      fromMin: true,
      caption: (values) =>
        `${formatNumber(Math.min(...values))} – ${formatNumber(
          Math.max(...values)
        )} m`,
    },
    {
      title: "Heart rate",
      data: streams.heartrate?.data,
      color: "#d93a3a",
      fromMin: true,
      caption: (values) =>
        `avg ${Math.round(average(values))} · max ${Math.max(...values)} bpm`,
    },
    {
      title: "Power",
      data: streams.watts?.data,
      color: "#3b6fd8",
      caption: (values) =>
        `avg ${Math.round(average(values))} · max ${Math.max(...values)} W`,
    },
  ];

  const visible = charts.filter(
    (chart): chart is ChartConfig & { data: number[] } =>
      !!chart.data && chart.data.length > 1
  );

  return (
    <>
      {visible.map((chart) => (
        <Card
          key={chart.title}
          style={{ gap: Theme.space.s }}
          accessible
          accessibilityLabel={`${chart.title} chart, ${chart.caption(chart.data)}`}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <AppText bold size={16}>
              {chart.title}
            </AppText>
            <AppText size={12} color={Theme.colors.textMuted}>
              {chart.caption(chart.data)}
            </AppText>
          </View>
          <ColumnChart
            data={chart.data}
            color={chart.color}
            fromMin={chart.fromMin}
          />
          {totalDistance ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText size={11} color={Theme.colors.textMuted}>
                0 km
              </AppText>
              <AppText size={11} color={Theme.colors.textMuted}>
                {formatDistance(totalDistance / 2)}
              </AppText>
              <AppText size={11} color={Theme.colors.textMuted}>
                {formatDistance(totalDistance)}
              </AppText>
            </View>
          ) : null}
        </Card>
      ))}
    </>
  );
};
