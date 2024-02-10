import NOT_FOUND from "../images/not_found.png";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Theme } from "../theme";
import { Button } from "../components/layout/Button";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { useAppContext } from "../hooks/useAppContext";
import { Text } from "react-native-paper";
import { SquareImg } from "../components/imgs/SquareImg";

export const Account = () => {
  const { me } = useAppContext();
  const navigation = useNavigation();
  const { logout } = useAppContext();

  return (
    <ScreenContainer
      style={{
        gap: Theme.space.l,
      }}
    >
      <View style={{ alignItems: "center", gap: 0 }}>
        <SquareImg
          size={144}
          source={
            me?.profile
              ? {
                  uri: me.profile,
                }
              : NOT_FOUND
          }
        />
        <Text
          variant="bodyLarge"
          style={{
            fontFamily: Theme.fonts.bold,
          }}
        >
          {me?.firstname}
          {me?.lastname ? ` ${me.lastname}` : ""}
        </Text>
        {me?.username && <Text variant="bodyLarge">@{me.username}</Text>}
      </View>
      <View
        style={{
          gap: Theme.space.s,
        }}
      >
        <Button mode="outlined" onPress={() => navigation.navigate("About")}>
          About the app
        </Button>

        <Button color={Theme.colors.red} mode="outlined" onPress={logout}>
          Logout
        </Button>
      </View>
    </ScreenContainer>
  );
};
