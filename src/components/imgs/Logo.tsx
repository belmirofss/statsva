import LOGO_IMG from "../../images/Statsva.png";
import { SquareImg } from "./SquareImg";

type Props = {
  size?: number;
};

export const Logo = ({ size }: Props) => {
  return <SquareImg source={LOGO_IMG} size={size} />;
};
