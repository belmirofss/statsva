import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Login } from "./screens/Login/Login";
import { useAppContext } from "./hooks/useAppContext";
import { About } from "./screens/About/About";
import { Home } from "./screens/Home/Home";
import { Activities } from "./screens/Activities/Activities";
import { Theme } from "./theme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ICON_SIZE = 28;

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.darken,
        tabBarShowLabel: false,
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
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="information"
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
      <Stack.Navigator>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
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
