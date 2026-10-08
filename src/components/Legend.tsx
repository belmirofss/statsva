import { View } from "react-native";
import { AppText } from "./layout/AppText";

type Props = {
  color: string;
  label: string;
};

/** A chart key: a short line in the series colour and its name. */
export const Legend = ({ color, label }: Props) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
    <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: color }} />
    <AppText bold size={13}>
      {label}
    </AppText>
  </View>
);
