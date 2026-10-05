import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Login } from "./screens/Login";
import { useAppContext } from "./hooks/useAppContext";
import { About } from "./screens/About";
import { Home } from "./screens/Home/Home";
import { Activities } from "./screens/Activities/Activities";
import { Theme } from "./theme";
import { Account } from "./screens/Account";
import { Activity } from "./screens/Activity/Activity";
import { IconName } from "./constants";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackHeaderOptions = {
  headerStyle: {
    backgroundColor: Theme.colors.surface,
    borderBottomColor: Theme.colors.border,
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontFamily: Theme.fonts.bold,
    fontSize: 17,
  },
  headerTintColor: Theme.colors.text,
  cardStyle: { backgroundColor: Theme.colors.background },
};

type TabIconProps = {
  icon: IconName;
  focusedIcon: IconName;
  focused: boolean;
  color: string;
};

const TabIcon = ({ icon, focusedIcon, focused, color }: TabIconProps) => (
  <View
    style={{
      width: 60,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: focused ? Theme.colors.primaryLight : "transparent",
    }}
  >
    <MaterialCommunityIcons
      name={focused ? focusedIcon : icon}
      size={22}
      color={color}
    />
  </View>
);

const AuthenticatedBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primaryDark,
        tabBarInactiveTintColor: Theme.colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: Theme.fonts.bold,
          fontSize: 12,
          marginTop: 2,
        },
        tabBarItemStyle: { paddingTop: 6 },
        tabBarStyle: {
          backgroundColor: Theme.colors.surface,
          borderTopColor: Theme.colors.border,
        },
        sceneStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: (props) => (
            <TabIcon icon="home-outline" focusedIcon="home" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={Activities}
        options={{
          tabBarIcon: (props) => (
            <TabIcon
              icon="format-list-bulleted"
              focusedIcon="format-list-bulleted"
              {...props}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: (props) => (
            <TabIcon icon="account-outline" focusedIcon="account" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const Routes = () => {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return (
      <Stack.Navigator
        initialRouteName="AuthenticatedBottomTabNavigator"
        screenOptions={stackHeaderOptions}
      >
        <Stack.Screen
          name="AuthenticatedBottomTabNavigator"
          component={AuthenticatedBottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Activity"
          component={Activity}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};
