import { useContext } from "react";
import AppContext from "../Context";

export const useAppContext = () => {
  const contextData = useContext(AppContext);

  return {
    ...contextData,
  };
};