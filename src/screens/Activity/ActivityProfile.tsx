import { View } from "react-native";
import { useAppContext } from "../../hooks/useAppContext";
import { Text } from "react-native-paper";
import { Theme } from "../../theme";
import { SquareImg } from "../../components/imgs/SquareImg";

export const ActivityProfile = () => {
  const { me } = useAppContext();

  if (!me) {
    return;
  }

  const name = me.firstname + (me.lastname ? ` ${me.lastname}` : "");

  return (
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
        <Text variant="labelMedium">@{me?.username}</Text>
      </View>
    </View>
  );
};
