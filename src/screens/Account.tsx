import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Theme } from "../theme";
import { Button } from "../components/layout/Button";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { useAppContext } from "../hooks/useAppContext";

export const Account = () => {
  const navigation = useNavigation();
  const { logout } = useAppContext();

  return (
    <ScreenContainer>
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
