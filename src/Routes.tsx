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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ICON_SIZE = 28;

const AuthenticatedBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.dark,
        tabBarShowLabel: false,
        headerStyle: {
          borderBottomColor: Theme.colors.gray,
          borderBottomWidth: 1,
          height: 100,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home"
              size={ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={Activities}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account"
              size={ICON_SIZE}
              color={color}
            />
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
        screenOptions={{
          headerStyle: {
            borderBottomColor: Theme.colors.gray,
            borderBottomWidth: 1,
            height: 100,
          },
        }}
      >
        <Stack.Screen
          name="AuthenticatedBottomTabNavigator"
          component={AuthenticatedBottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Activity" component={Activity} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};
