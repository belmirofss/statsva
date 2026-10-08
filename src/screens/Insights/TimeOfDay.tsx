import { useMemo, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "../../theme";
import { useActivityHistory } from "../../hooks/useActivityHistory";
import { DetailScreen } from "../../components/layout/DetailScreen";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import { ChipGroup } from "../../components/ChipGroup";
import { timeProfile } from "../../insights/timeOfDay";
import { formatHourRange } from "../../insights/dates";
import {
  SPORT_FILTER_OPTIONS,
  SPORT_FILTER_UNIT,
  SportFilter,
  mainSport,
  matchesSport,
} from "../../insights/sports";

const CLOCK = 280;
const INNER = 58;
const SPAN = 70;
const BAR = 9;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const barColor = (count: number, max: number) =>
  count >= max * 0.66
    ? Theme.colors.primary
    : count >= max * 0.33
    ? "#fd8a57"
    : Theme.colors.primaryMuted;

/** 24 bars around a clock face, midnight at the top. Built from rotated Views. */
const HourClock = ({ hours, favourite }: { hours: number[]; favourite: number }) => {
  const max = Math.max(1, ...hours);
  const center = CLOCK / 2;

  return (
    <View style={{ width: CLOCK, height: CLOCK, alignSelf: "center" }}>
      <View
        style={{
          position: "absolute",
          left: center - INNER + 6,
          top: center - INNER + 6,
          width: (INNER - 6) * 2,
          height: (INNER - 6) * 2,
          borderRadius: INNER,
          borderWidth: 1,
          borderColor: Theme.colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText bold size={20}>
          {formatHourRange(favourite)}
        </AppText>
        <AppText size={11} color={Theme.colors.textMuted}>
          favourite hour
        </AppText>
      </View>

      {hours.map((count, hour) => {
        if (!count) return null;
        const length = 6 + (count / max) * SPAN;
        const angle = ((hour + 0.5) / 24) * 2 * Math.PI - Math.PI / 2;
        const radius = INNER + length / 2;
        return (
          <View
            key={hour}
            style={{
              position: "absolute",
              left: center + Math.cos(angle) * radius - length / 2,
              top: center + Math.sin(angle) * radius - BAR / 2,
              width: length,
              height: BAR,
              borderRadius: BAR / 2,
              backgroundColor: barColor(count, max),
              transform: [{ rotate: `${angle}rad` }],
            }}
          />
        );
      })}

      {[
        { label: "0", left: center - 10, top: 0 },
        { label: "6", left: CLOCK - 20, top: center - 8 },
        { label: "12", left: center - 10, top: CLOCK - 16 },
        { label: "18", left: 0, top: center - 8 },
      ].map(({ label, left, top }) => (
        <AppText
          key={label}
          size={11}
          color={Theme.colors.textMuted}
          style={{ position: "absolute", left, top, width: 20, textAlign: "center" }}
        >
          {label}
        </AppText>
      ))}
    </View>
  );
};

export const TimeOfDay = () => {
  const history = useActivityHistory();
  const [sport, setSport] = useState<SportFilter>();
  const year = moment().year();

  const thisYear = useMemo(
    () =>
      (history.data ?? []).filter(
        (a) => Number(a.start_date_local.slice(0, 4)) === year
      ),
    [history.data, year]
  );
  const activeSport = sport ?? mainSport(thisYear);

  const profile = useMemo(
    () => timeProfile(thisYear.filter((a) => matchesSport(activeSport, a))),
    [thisYear, activeSport]
  );

  const maxWeekday = Math.max(1, ...profile.weekdays);

  return (
    <DetailScreen
      title="Time of day"
      subtitle={`${year} · ${profile.count} ${SPORT_FILTER_UNIT[activeSport]}`}
      isLoading={history.isLoading}
      isError={history.isError}
      onRefresh={history.refetch}
    >
      <ChipGroup
        scrollable
        variant="solid"
        value={activeSport}
        onChange={setSport}
        options={SPORT_FILTER_OPTIONS}
      />

      {profile.count > 0 && (
        <>
          <Card style={{ marginHorizontal: Theme.gutter, gap: Theme.space.m }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: Theme.colors.primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="weather-sunset-up"
                  size={24}
                  color={Theme.colors.primaryDark}
                />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText bold size={22}>
                  {profile.persona.title}
                </AppText>
                {!!profile.persona.caption && (
                  <AppText size={13} color={Theme.colors.textMuted}>
                    {profile.persona.caption}
                  </AppText>
                )}
              </View>
            </View>
            <View
              accessible
              accessibilityLabel={`Start times on a 24-hour clock. Most often ${formatHourRange(
                profile.favouriteHour
              )}.`}
            >
              <HourClock hours={profile.hours} favourite={profile.favouriteHour} />
            </View>
          </Card>

          <Card style={{ marginHorizontal: Theme.gutter, gap: 12 }}>
            <AppText bold size={16}>
              By weekday
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 110 }}>
              {profile.weekdays.map((count, index) => (
                <View
                  key={WEEKDAYS[index]}
                  style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 4, height: 110 }}
                  accessible
                  accessibilityLabel={`${WEEKDAYS[index]}: ${count}`}
                >
                  <AppText bold size={11}>
                    {count}
                  </AppText>
                  <View
                    style={{
                      width: "100%",
                      height: Math.max(3, (count / maxWeekday) * 70),
                      borderRadius: 6,
                      backgroundColor:
                        count === maxWeekday ? Theme.colors.primary : Theme.colors.primaryMuted,
                    }}
                  />
                  <AppText size={11} color={Theme.colors.textMuted}>
                    {WEEKDAYS[index]}
                  </AppText>
                </View>
              ))}
            </View>
          </Card>

          <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: Theme.gutter }}>
            <Card style={{ flex: 1, gap: 4 }}>
              <AppText size={12} color={Theme.colors.textMuted}>
                Sunrise starts
              </AppText>
              <AppText bold size={24}>
                {profile.sunriseCount}
              </AppText>
              <AppText size={12} color={Theme.colors.textMuted} style={{ lineHeight: 16 }}>
                within 30 min of sunrise
              </AppText>
            </Card>
            <Card style={{ flex: 1, gap: 4 }}>
              <AppText size={12} color={Theme.colors.textMuted}>
                In the dark
              </AppText>
              <AppText bold size={24}>
                {profile.darkCount}
              </AppText>
              <AppText size={12} color={Theme.colors.textMuted} style={{ lineHeight: 16 }}>
                started before sunrise or finished after sunset
              </AppText>
            </Card>
          </View>
        </>
      )}
      {!history.isLoading && profile.count === 0 && (
        <AppText color={Theme.colors.textMuted} style={{ paddingHorizontal: Theme.gutter }}>
          No {SPORT_FILTER_UNIT[activeSport]} this year yet.
        </AppText>
      )}
    </DetailScreen>
  );
};
