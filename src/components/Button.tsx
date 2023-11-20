import { Button as PaperButton, Text } from "react-native-paper";
import { ReactNode, ComponentProps } from "react";
import { Theme } from "../theme";

type Props = {
  children: ReactNode;
  onPress: () => void;
  mode?: ComponentProps<typeof PaperButton>["mode"];
  disabled?: boolean;
};

export const Button = ({
  children,
  onPress,
  mode = "contained",
  disabled = false,
}: Props) => {
  const color =
    mode === "outlined" ? Theme.colors.darken : Theme.colors.contrast;

  return (
    <PaperButton mode={mode} onPress={onPress} disabled={disabled}>
      <Text
        variant="titleMedium"
        style={{
          fontFamily: Theme.fonts.bold,
          color,
        }}
      >
        {children}
      </Text>
    </PaperButton>
  );
};
