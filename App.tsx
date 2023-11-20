import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import ubuntuBold from "./src/fonts/Ubuntu-Bold.ttf";
import ubuntuRegular from "./src/fonts/Ubuntu-Regular.ttf";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";
import { Theme } from "./src/theme";
import { AppProvider } from "./src/Context";
import { Routes } from "./src/Routes";

const theme = {
  ...DefaultTheme,
  roundness: Theme.roundness,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.colors.primary,
  },
  fonts: configureFonts({
    config: {
      fontFamily: Theme.fonts.regular,
    },
  }),
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    ubuntuRegular,
    ubuntuBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <AppProvider>
            <NavigationContainer>
              <Routes />
            </NavigationContainer>
          </AppProvider>

          <StatusBar hidden />
        </PaperProvider>
      </QueryClientProvider>
    </View>
  );
}
