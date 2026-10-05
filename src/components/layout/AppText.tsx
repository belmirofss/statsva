import { Text, TextProps } from "react-native";
import { Theme } from "../../theme";

type Props = TextProps & {
  size?: number;
  bold?: boolean;
  color?: string;
};

export const AppText = ({
  size = 14,
  bold = false,
  color = Theme.colors.text,
  style,
  ...props
}: Props) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: bold ? Theme.fonts.bold : Theme.fonts.regular,
          fontSize: size,
          color,
        },
        style,
      ]}
    />
  );
};
