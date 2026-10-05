import { View } from "react-native";
import { Activity } from "../../types";
import { Theme } from "../../theme";
import { SPORT_TYPE_TO_LABEL } from "../../constants";
import { activityLocalMoment } from "../../helpers";
import { AppText } from "../../components/layout/AppText";
import { SportIcon } from "../../components/SportIcon";

type Props = {
  activity: Activity;
};

export const ActivityTitle = ({ activity }: Props) => {
  const location = [
    activity.location_city,
    activity.location_state,
    activity.location_country,
  ]
    .filter(Boolean)
    .join(", ");
  const tags = [
    activity.trainer && "Indoor",
    activity.manual && "Manual entry",
  ].filter(Boolean);

  return (
    <View style={{ gap: 6 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: Theme.space.s }}
      >
        <SportIcon sportType={activity.sport_type} />
        <AppText size={13} color={Theme.colors.textMuted} style={{ flex: 1 }}>
          {SPORT_TYPE_TO_LABEL[activity.sport_type] ?? activity.sport_type} ·{" "}
          {activityLocalMoment(activity.start_date_local).format(
            "ddd, MMM D YYYY · HH:mm"
          )}
        </AppText>
      </View>
      <AppText
        bold
        size={26}
        accessibilityRole="header"
        style={{ lineHeight: 30, letterSpacing: -0.3 }}
      >
        {activity.name}
      </AppText>
      {(!!location || !!tags.length) && (
        <AppText color={Theme.colors.textMuted}>
          {[location, ...tags].filter(Boolean).join(" · ")}
        </AppText>
      )}
      {!!activity.description && (
        <AppText style={{ marginTop: Theme.space.xs, lineHeight: 20 }}>
          {activity.description}
        </AppText>
      )}
    </View>
  );
};
