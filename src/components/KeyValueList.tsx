import { View } from "react-native";
import { Theme } from "../theme";
import { KeyValue } from "./KeyValue";
import { TitleAndContent } from "../types";

type Props = {
  data: TitleAndContent[];
};

export const KeyValueList = ({ data }: Props) => {
  return (
    <View
      style={{
        flexDirection: "column",
        gap: Theme.space.s,
      }}
    >
      {data.map(({ title, content }) => (
        <KeyValue key={title} text={title} value={content || "-"} />
      ))}
    </View>
  );
};
