import { View } from "react-native";
import { useAppContext } from "../hooks/useAppContext";
import { Logo } from "./imgs/Logo";
import { Theme } from "../theme";
import { SquareImg } from "./imgs/SquareImg";
import { AppText } from "./layout/AppText";

type Props = {
  color: string;
  mutedColor: string;
  accentColor: string;
  showAthlete: boolean;
};

export const ShareFooter = ({
  color,
  mutedColor,
  accentColor,
  showAthlete,
}: Props) => {
  const { me } = useAppContext();

  const name = me
    ? me.firstname + (me.lastname ? ` ${me.lastname}` : "")
    : undefined;
  const photo = me?.profile?.startsWith("http") ? me.profile : undefined;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Theme.space.xs,
        }}
      >
        <Logo size={28} />
        <AppText bold size={13} color={accentColor}>
          Stats-va
        </AppText>
      </View>

      {showAthlete && name && (
        <View
          style={{
            flexDirection: "row",
            gap: Theme.space.s,
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <AppText bold size={12} color={color}>
              {name}
            </AppText>
            {me?.username && (
              <AppText size={11} color={mutedColor}>
                @{me.username}
              </AppText>
            )}
          </View>
          {photo && <SquareImg size={28} source={{ uri: photo }} />}
        </View>
      )}
    </View>
  );
};
