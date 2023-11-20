import { Image } from "react-native";
import LOGO_IMG from "../images/Statsva.png";

export const Logo = () => {
  return (
    <Image
      style={{
        height: 100,
        width: 100,
      }}
      source={LOGO_IMG}
    />
  );
};
