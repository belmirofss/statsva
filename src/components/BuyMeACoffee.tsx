import { useEffect, useState } from "react";
import { Image } from "react-native";
import { Banner } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BUY_ME_A_COFFEE_URL } from "../constants";
import { Theme } from "../theme";
import BUY_ME_A_COFFEEE from "../images/buy_me_a_coffee.png";

const KEY = "STATSVA.BUY_ME_A_COFFEE";
const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

export const BuyMeACoffe = () => {
  const [visible, setVisible] = useState(false);

  const dismiss = async () => {
    setVisible(false);
    AsyncStorage.setItem(KEY, new Date().toISOString());
  };

  const open = async () =>
    await WebBrowser.openBrowserAsync(BUY_ME_A_COFFEE_URL);

  const loadVisible = async () => {
    const dismissDate: string = (await AsyncStorage.getItem(KEY)) || "";
    const diff = new Date().getTime() - new Date(dismissDate).getTime();

    setVisible(Boolean(!dismissDate || diff > SEVEN_DAYS_MS));
  };

  useEffect(() => {
    loadVisible();
  }, []);

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: "No",
          onPress: dismiss,
          textColor: Theme.colors.dark,
        },
        {
          label: "Buy me a coffee",
          onPress: open,
        },
      ]}
      icon={() => (
        <Image
          source={BUY_ME_A_COFFEEE}
          style={{
            width: 75,
            height: 75,
          }}
        />
      )}
      style={{
        backgroundColor: Theme.colors.white,
        borderRadius: Theme.roundness,
      }}
      elevation={0}
    >
      If you've enjoyed using this app, consider buying me a coffee as a token
      of appreciation.
    </Banner>
  );
};
