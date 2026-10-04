import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import API from "./api";
import { revokeStoredSession, storeSession } from "./session";
import { useStravaOauthToken } from "./hooks/useStravaOauthToken";
import { SummaryAthlete } from "./types";

type AppContextData = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isErrorOnAuthentication: boolean;
  me?: SummaryAthlete;
  authenticate: (token: string) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextData>({} as AppContextData);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isErrorOnAuthentication, setIsErrorOnAuthentication] = useState(false);
  const [me, setMe] = useState<SummaryAthlete>();

  const pendingRevocation = useRef<Promise<void>>(Promise.resolve());

  const { mutateAsync: performStravaOauthToken } = useStravaOauthToken();

  const setUpToken = async (code: string) => {
    await pendingRevocation.current;
    const response = await performStravaOauthToken({ code });
    const { access_token: token, refresh_token, athlete } = response.data;
    setMe(athlete);
    await storeSession(token, refresh_token);
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

  const logout = () => {
    delete API.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    pendingRevocation.current =
      pendingRevocation.current.then(revokeStoredSession);
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
      },
    );

    logout();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        isErrorOnAuthentication,
        me,
        authenticate,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
