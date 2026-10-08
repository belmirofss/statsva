import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Stats-va",
  slug: "statsva",
  version: "2.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "com.yabcompany.statsva",
  userInterfaceStyle: "light",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.yabcompany.statsva",
    versionCode: 18,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#fc4c02",
    },
    permissions: ["com.google.android.gms.permission.AD_ID"],
    // Play policy forbids broad media access when a system picker would do;
    // sharing only writes to the app cache, so none of these are needed.
    blockedPermissions: [
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.READ_MEDIA_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  githubUrl: "https://github.com/belmirofss/statsva",
  extra: {
    eas: {
      projectId: "d165a805-b3e5-453b-86a7-9812447f881e",
    },
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  updates: {
    url: "https://u.expo.dev/d165a805-b3e5-453b-86a7-9812447f881e",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 24,
          buildToolsVersion: "36.0.0",
        },
        ios: {
          deploymentTarget: "15.1",
        },
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-6575307967199593~6881451549",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#fc4c02",
        image: "./assets/splash.png",
        imageWidth: 250,
      },
    ],
    "expo-font",
    "expo-secure-store",
  ],
});
