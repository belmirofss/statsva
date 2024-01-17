import { SportType } from "../types";
import { Picker } from "./Picker";

type ValueType = SportType.RIDE | SportType.RUN | SportType.SWIM;

type Props = {
  selectedValue: ValueType;
  onSelection: (value: ValueType) => void;
};

export const SportPicker = ({ selectedValue, onSelection }: Props) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onSelection={(value) => onSelection(value as ValueType)}
      items={[
        {
          value: SportType.RIDE,
          text: "Ride",
        },
        {
          value: SportType.RUN,
          text: "Run",
        },
        { value: SportType.SWIM, text: "Swim" },
      ]}
    />
  );
};
