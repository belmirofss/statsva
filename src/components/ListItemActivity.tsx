import { View } from "react-native";
import { SummaryActivity } from "../types";
import { Theme } from "../theme";
import { Map } from "./Map";
import React from "react";
import moment from "moment";
import { SPORT_TYPE_TO_ICON, SPORT_TYPE_TO_LABEL } from "../constants";
import { ListItemHeader } from "./ListItemHeader";

type Props = {
  activity: SummaryActivity;
};

export const ListItemActivity = React.memo(({ activity }: Props) => {
  return (
    <View style={{ marginBottom: Theme.space.xl }}>
      <View>
        <ListItemHeader
          title={SPORT_TYPE_TO_LABEL[activity.sport_type]}
          subTitle={moment(activity.start_date_local).format("lll")}
          renderIcon={SPORT_TYPE_TO_ICON[activity.sport_type]}
        />
      </View>

      <View style={{ marginTop: Theme.space.s }}>
        <Map polyline={activity.map.summary_polyline} />
      </View>
    </View>
  );
});
