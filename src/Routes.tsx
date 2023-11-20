import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./screens/Login/Login";
import { useAppContext } from "./hooks/useAppContext";
import { About } from "./screens/About/About";

const Stack = createStackNavigator();

export const Routes = () => {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return (
      <Stack.Navigator>
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
