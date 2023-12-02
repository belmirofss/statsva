import { createContext, ReactNode, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN_KEY } from "./constants";
import API from "./api";
import { useStravaOauthToken } from "./hooks/useStravaOauthToken";
import { SummaryAthlete } from "./types";

type AppContextData = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isErrorOnAuthentication: boolean;
  adShowed: boolean;
  me?: SummaryAthlete;
  authenticate: (token: string) => void;
  logout: () => void;
  markAdAsShowed: () => void;
};

const AppContext = createContext<AppContextData>({} as AppContextData);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isErrorOnAuthentication, setIsErrorOnAuthentication] = useState(false);
  const [adShowed, setAdShowed] = useState(false);
  const [me, setMe] = useState<SummaryAthlete>();

  const { mutateAsync: performStravaOauthToken } = useStravaOauthToken();

  const setUpToken = async (code: string) => {
    const response = await performStravaOauthToken({ code });
    console.log(response.data);
    const { access_token: token, athlete } = response.data;
    setMe(athlete);
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    API.defaults.headers.common["Authorization"] = "Bearer " + token;
  };

  const authenticate = (code: string) => {
    setIsAuthenticating(true);
    setIsErrorOnAuthentication(false);

    setUpToken(code)
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsErrorOnAuthentication(true);
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
  };

  const markAdAsShowed = () => setAdShowed(true);

  const logout = () => {
    delete API.defaults.headers.common["Authorization"];
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).then(() =>
      setIsAuthenticated(false)
    );
  };

  useEffect(() => {
    API.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          alert("Your session has expired! To continue, connect again.");
          logout();
        }
        return Promise.reject(error);
      }
    );

    logout();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        isErrorOnAuthentication,
        adShowed,
        me,
        authenticate,
        logout,
        markAdAsShowed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
