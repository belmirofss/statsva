import { Image, ImageSourcePropType } from "react-native";

type Props = {
  source: ImageSourcePropType;
  size?: number;
};

export const SquareImg = ({ source, size = 100 }: Props) => {
  return (
    <Image
      style={{
        height: size,
        width: size,
      }}
      source={source}
    />
  );
};
