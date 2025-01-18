import { View } from "react-native";
import { useAppContext } from "../hooks/useAppContext";
import { Text } from "react-native-paper";
import { Logo } from "./imgs/Logo";
import { Theme } from "../theme";
import { SquareImg } from "./imgs/SquareImg";

export const ShareFooter = () => {
  const { me } = useAppContext();

  if (!me) {
    return;
  }

  const name = me.firstname + (me.lastname ? ` ${me.lastname}` : "");

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
        <Logo size={36} />
        <Text
          variant="labelMedium"
          style={{
            fontFamily: Theme.fonts.bold,
            color: Theme.colors.primary,
          }}
        >
          Stats-va
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: Theme.space.xs,
          alignItems: "center",
        }}
      >
        {me.profile && (
          <SquareImg
            size={36}
            source={{
              uri: me.profile,
            }}
          />
        )}

        <View>
          <Text
            variant="labelMedium"
            style={{
              fontFamily: Theme.fonts.bold,
            }}
          >
            {name}
          </Text>
          {me?.username && <Text variant="labelMedium">@{me.username}</Text>}
        </View>
      </View>
    </View>
  );
};
