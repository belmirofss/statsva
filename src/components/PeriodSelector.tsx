import { SegmentedButtons } from "react-native-paper";
import { Period } from "../types";
import { Theme } from "../theme";

type Props = {
  value: Period;
  onChanges: (sportType: Period) => void;
};

export const PeriodSelector = ({ value, onChanges }: Props) => {
  const labelStyle = {
    fontFamily: Theme.fonts.bold,
  };

  return (
    <SegmentedButtons
      value={value}
      onValueChange={(value) => onChanges(value as Period)}
      buttons={[
        {
          value: Period.LAST_4_WEEKS,
          label: "Recently",
          labelStyle,
        },
        {
          value: Period.YEAR_TO_DATE,
          label: "This year",
          labelStyle,
        },
        { value: Period.ALL_TIME, label: "All time", labelStyle },
      ]}
    />
  );
};
