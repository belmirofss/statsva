import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "../theme";
import { IconName } from "../constants";
import { useAppContext } from "../hooks/useAppContext";
import { LargeHeader } from "../components/layout/ScreenHeader";
import { Card } from "../components/layout/Card";
import { AppText } from "../components/layout/AppText";
import { Avatar } from "../components/Avatar";
import { openBuyMeACoffee } from "../components/BuyMeACoffee";

export const Account = () => {
  const { me, logout } = useAppContext();
  const navigation = useNavigation();

  const name = [me?.firstname, me?.lastname].filter(Boolean).join(" ");
  const location = [me?.city, me?.state, me?.country].filter(Boolean).join(", ");

  const actions: {
    icon: IconName;
    label: string;
    onPress: () => void;
    color?: string;
  }[] = [
    {
      icon: "shoe-sneaker",
      label: "Gear",
      onPress: () => navigation.navigate("Gear"),
    },
    {
      icon: "information-outline",
      label: "About the app",
      onPress: () => navigation.navigate("About"),
    },
    {
      icon: "coffee-outline",
      label: "Buy me a coffee",
      onPress: openBuyMeACoffee,
    },
    {
      icon: "logout",
      label: "Log out",
      onPress: logout,
      color: Theme.colors.red,
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Theme.colors.background }}
      contentContainerStyle={{ gap: Theme.space.m, paddingBottom: Theme.space.xl }}
    >
      <LargeHeader title="Profile" />

      <Card
        style={{
          marginHorizontal: Theme.gutter,
          alignItems: "center",
          gap: 4,
          paddingVertical: Theme.space.l,
        }}
      >
        <Avatar athlete={me} size={96} />
        <AppText bold size={20} style={{ marginTop: Theme.space.s }}>
          {name}
        </AppText>
        {me?.username && (
          <AppText color={Theme.colors.textMuted}>@{me.username}</AppText>
        )}
        {!!location && (
          <AppText size={13} color={Theme.colors.textMuted}>
            {location}
          </AppText>
        )}
      </Card>

      <Card style={{ marginHorizontal: Theme.gutter, paddingVertical: 0 }}>
        {actions.map((action, index) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            accessibilityRole="button"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Theme.space.m,
              minHeight: 56,
              borderTopWidth: index ? 1 : 0,
              borderTopColor: Theme.colors.border,
            }}
          >
            <MaterialCommunityIcons
              name={action.icon}
              size={22}
              color={action.color ?? Theme.colors.text}
            />
            <AppText
              size={16}
              color={action.color ?? Theme.colors.text}
              style={{ flex: 1 }}
            >
              {action.label}
            </AppText>
            {!action.color && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={Theme.colors.textMuted}
              />
            )}
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
};
