import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { IconName } from "../../constants";
import { ActivityWeather as Weather } from "../../hooks/useActivityWeather";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";

export const formatWeather = (weather: Weather) =>
  `${Math.round(weather.temperature)}° · ${weather.condition}`;

const Tile = ({ icon, value, label }: { icon: IconName; value: string; label: string }) => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      gap: 4,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 14,
      backgroundColor: Theme.colors.background,
    }}
  >
    <MaterialCommunityIcons name={icon} size={20} color={Theme.colors.textMuted} />
    <AppText bold size={15}>
      {value}
    </AppText>
    <AppText size={11} color={Theme.colors.textMuted}>
      {label}
    </AppText>
  </View>
);

type Props = {
  weather: Weather;
};

export const ActivityWeather = ({ weather }: Props) => {
  const temps = weather.hours.map((hour) => hour.temperature);
  const low = Math.min(...temps);
  const high = Math.max(...temps);
  const finish = temps[temps.length - 1];

  return (
    <Card style={{ gap: Theme.space.m }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <AppText bold size={16}>
          Weather
        </AppText>
        <AppText size={12} color={Theme.colors.textMuted}>
          at start · Open-Meteo
        </AppText>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", gap: Theme.space.m }}
        accessible
        accessibilityLabel={`${Math.round(weather.temperature)} degrees, ${weather.condition}, feels like ${Math.round(weather.feelsLike)}`}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: Theme.colors.primaryLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name={weather.icon} size={36} color={Theme.colors.primaryDark} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <AppText bold size={40} style={{ letterSpacing: -1 }}>
              {Math.round(weather.temperature)}°
            </AppText>
            <AppText bold size={16} style={{ flexShrink: 1 }}>
              {weather.condition}
            </AppText>
          </View>
          <AppText size={13} color={Theme.colors.textMuted}>
            Feels like {Math.round(weather.feelsLike)}°
            {temps.length > 1 ? ` · ${Math.round(finish)}° at finish` : ""}
          </AppText>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: Theme.space.s }}>
        <Tile icon="weather-windy" value={`${Math.round(weather.windSpeed)}`} label={`km/h ${weather.windDirection}`} />
        <Tile icon="water-percent" value={`${Math.round(weather.humidity)}%`} label="humidity" />
        <Tile
          icon="weather-rainy"
          value={`${weather.precipitation >= 10 ? Math.round(weather.precipitation) : weather.precipitation.toFixed(1)} mm`}
          label="rain"
        />
      </View>

      {weather.hours.length > 1 && (
        <View style={{ gap: Theme.space.s }}>
          <AppText size={13} color={Theme.colors.textMuted}>
            During your activity
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 64 }}>
            {weather.hours.map((hour) => {
              const ratio = high > low ? (hour.temperature - low) / (high - low) : 0.5;
              return (
                <View key={hour.time} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                  <AppText bold size={11}>
                    {Math.round(hour.temperature)}°
                  </AppText>
                  <View
                    style={{
                      width: "100%",
                      height: 12 + ratio * 30,
                      borderRadius: 6,
                      backgroundColor: ratio > 0.66 ? Theme.colors.primary : Theme.colors.primaryMuted,
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText size={11} color={Theme.colors.textMuted}>
              {weather.hours[0].time}
            </AppText>
            <AppText size={11} color={Theme.colors.textMuted}>
              {weather.hours[weather.hours.length - 1].time}
            </AppText>
          </View>
        </View>
      )}
    </Card>
  );
};
