import { View } from "react-native";
import { Activity } from "../../types";
import { Theme } from "../../theme";
import { formatDistance, formatTime } from "../../helpers";
import { Card } from "../../components/layout/Card";
import { AppText } from "../../components/layout/AppText";
import {
  Decoupling,
  Pacing,
  RacePrediction,
  SplitType,
} from "../../insights/runAnalysis";

/** Seconds per km as "m:ss". */
const pace = (seconds: number) => {
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
};

const SPLIT_LABEL: { [key in SplitType]: string } = {
  negative: "Negative split",
  even: "Even split",
  positive: "Positive split",
};

const DECOUPLING_GOOD = 5;
const DECOUPLING_SCALE = 10;

const Badge = ({ label, accent }: { label: string; accent: boolean }) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: accent ? Theme.colors.primaryLight : Theme.colors.control,
    }}
  >
    <AppText bold size={12} color={accent ? Theme.colors.primaryDark : Theme.colors.text}>
      {label}
    </AppText>
  </View>
);

const Header = ({ title, badge }: { title: string; badge?: { label: string; accent: boolean } }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
    <AppText bold size={16}>
      {title}
    </AppText>
    {badge && <Badge {...badge} />}
  </View>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flex: 1, gap: 2 }}>
    <AppText size={12} color={Theme.colors.textMuted}>
      {label}
    </AppText>
    <AppText bold size={18} numberOfLines={1} adjustsFontSizeToFit>
      {value}
    </AppText>
  </View>
);

export const PacingCard = ({ activity, pacing }: { activity: Activity; pacing: Pacing }) => {
  const splits = (activity.splits_metric ?? []).filter((s) => s.distance >= 950 && s.average_speed > 0);
  const paces = splits.map((s) => 1000 / s.average_speed);
  const slowest = Math.max(...paces);
  const fastest = Math.min(...paces);
  const average = paces.reduce((sum, p) => sum + p, 0) / paces.length;
  const difference = Math.round(Math.abs(pacing.secondHalf - pacing.firstHalf));

  const summary =
    pacing.type === "negative"
      ? `You finished ${difference} s/km faster than you started${pacing.isLastFastest ? ", and the last km was your quickest" : ""}.`
      : pacing.type === "positive"
      ? `You slowed by ${difference} s/km in the second half. Starting a touch easier often pays off.`
      : "You held a steady pace from start to finish.";

  return (
    <Card style={{ gap: 14 }}>
      <Header title="Pacing" badge={{ label: SPLIT_LABEL[pacing.type], accent: pacing.type === "negative" }} />
      <View style={{ flexDirection: "row", gap: Theme.space.s }}>
        <Stat label="1st half" value={`${pace(pacing.firstHalf)} /km`} />
        <Stat label="2nd half" value={`${pace(pacing.secondHalf)} /km`} />
        <Stat label="Consistency" value={`${pacing.consistency}/100`} />
      </View>
      <View
        accessible
        accessibilityLabel={`Pace per kilometre, fastest ${pace(fastest)}, slowest ${pace(slowest)}`}
        style={{ flexDirection: "row", alignItems: "flex-end", gap: splits.length > 20 ? 2 : 5, height: 120 }}
      >
        {paces.map((value, index) => (
          <View key={index} style={{ flex: 1, alignItems: "center", gap: 4 }}>
            {splits.length <= 12 && (
              <AppText size={10} color={Theme.colors.textMuted}>
                {pace(value)}
              </AppText>
            )}
            <View
              style={{
                width: "100%",
                height: slowest > fastest ? 30 + ((slowest - value) / (slowest - fastest)) * 50 : 55,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
                backgroundColor: value < average ? Theme.colors.primary : Theme.colors.primaryMuted,
              }}
            />
            {splits.length <= 20 && (
              <AppText size={10} color={Theme.colors.textMuted}>
                {index + 1}
              </AppText>
            )}
          </View>
        ))}
      </View>
      <AppText size={13} color={Theme.colors.textMuted} style={{ lineHeight: 19 }}>
        {summary}
      </AppText>
    </Card>
  );
};

export const DecouplingCard = ({ decoupling }: { decoupling: Decoupling }) => {
  const percent = Math.max(0, decoupling.percent);
  const good = percent < DECOUPLING_GOOD;

  return (
    <Card style={{ gap: 14 }}>
      <Header title="Heart-rate drift" badge={{ label: good ? "Good" : "High", accent: !good }} />
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
        <AppText bold size={36} style={{ letterSpacing: -1 }}>
          {percent.toFixed(1)}%
        </AppText>
        <AppText size={13} color={Theme.colors.textMuted}>
          aerobic decoupling
        </AppText>
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ height: 10, flexDirection: "row", borderRadius: 5, overflow: "hidden" }}>
          <View style={{ flex: 1, backgroundColor: Theme.colors.primaryMuted }} />
          <View style={{ flex: 1, backgroundColor: "#fd8a57" }} />
        </View>
        <View
          style={{
            position: "absolute",
            top: -5,
            left: `${(Math.min(percent, DECOUPLING_SCALE) / DECOUPLING_SCALE) * 100}%`,
            marginLeft: -3,
            width: 6,
            height: 20,
            borderRadius: 3,
            backgroundColor: Theme.colors.text,
            borderWidth: 1.5,
            borderColor: Theme.colors.white,
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText size={11} color={Theme.colors.textMuted}>
            0%
          </AppText>
          <AppText size={11} color={Theme.colors.textMuted}>
            5% · solid aerobic base below
          </AppText>
          <AppText size={11} color={Theme.colors.textMuted}>
            10%+
          </AppText>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: Theme.space.s }}>
        {[
          { label: "1st half", part: decoupling.first },
          { label: "2nd half", part: decoupling.second },
        ].map(({ label, part }) => (
          <View
            key={label}
            style={{ flex: 1, gap: 2, padding: 12, borderRadius: 14, backgroundColor: Theme.colors.background }}
          >
            <AppText size={12} color={Theme.colors.textMuted}>
              {label}
            </AppText>
            <AppText bold size={15}>
              {pace(part.pace)} /km · {Math.round(part.heartrate)} bpm
            </AppText>
          </View>
        ))}
      </View>
      <AppText size={13} color={Theme.colors.textMuted} style={{ lineHeight: 19 }}>
        How much your pace per heartbeat dropped from the first half to the second.
        Most meaningful on steady, flat runs.
      </AppText>
    </Card>
  );
};

export const PredictorCard = ({ prediction }: { prediction: RacePrediction }) => (
  <Card style={{ gap: 4 }}>
    <View style={{ gap: 2, marginBottom: 8 }}>
      <AppText bold size={16}>
        Race predictor
      </AppText>
      <AppText size={13} color={Theme.colors.textMuted}>
        From {prediction.sourceName}: {formatDistance(prediction.sourceDistance)} in{" "}
        {formatTime(Math.round(prediction.sourceSeconds))}
      </AppText>
    </View>
    {prediction.predictions.map((race) => {
      const isSource = Math.abs(race.distance - prediction.sourceDistance) < 50;
      return (
        <View
          key={race.label}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            minHeight: 52,
            borderTopWidth: 1,
            borderTopColor: Theme.colors.border,
          }}
        >
          <View
            style={{
              minWidth: 64,
              height: 36,
              paddingHorizontal: 8,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isSource ? Theme.colors.primaryDark : Theme.colors.primaryLight,
            }}
          >
            <AppText bold size={13} color={isSource ? Theme.colors.white : Theme.colors.primaryDark}>
              {race.label}
            </AppText>
          </View>
          <AppText size={13} color={Theme.colors.textMuted} style={{ flex: 1 }}>
            {pace(race.seconds / (race.distance / 1000))} /km
          </AppText>
          <AppText bold size={20}>
            {formatTime(Math.round(race.seconds))}
          </AppText>
        </View>
      );
    })}
    <AppText size={12} color={Theme.colors.textMuted} style={{ lineHeight: 18, marginTop: 6 }}>
      Riegel's formula. Longer races assume you have trained for the distance.
    </AppText>
  </Card>
);

type Props = {
  activity: Activity;
  pacing?: Pacing;
  decoupling?: Decoupling;
  prediction?: RacePrediction;
};

export const ActivityAnalysis = ({ activity, pacing, decoupling, prediction }: Props) => (
  <>
    {pacing && <PacingCard activity={activity} pacing={pacing} />}
    {decoupling && <DecouplingCard decoupling={decoupling} />}
    {prediction && <PredictorCard prediction={prediction} />}
  </>
);
