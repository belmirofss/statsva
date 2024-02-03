import { Button as PaperButton, Text } from "react-native-paper";
import { ReactNode, ComponentProps } from "react";
import { Theme } from "../../theme";

type Props = {
  children: ReactNode;
  onPress: () => void;
  mode?: ComponentProps<typeof PaperButton>["mode"];
  disabled?: boolean;
  color?: string;
};

export const Button = ({
  children,
  onPress,
  mode = "contained",
  disabled = false,
  color,
}: Props) => {
  const textColor =
    mode === "outlined" ? color || Theme.colors.dark : Theme.colors.white;

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      theme={{
        colors: color
          ? {
              primary: color,
            }
          : {},
      }}
    >
      <Text
        variant="titleMedium"
        style={{
          fontFamily: Theme.fonts.bold,
          color: textColor,
        }}
      >
        {children}
      </Text>
    </PaperButton>
  );
};
