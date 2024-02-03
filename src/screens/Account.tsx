import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Theme } from "../theme";
import { Button } from "../components/layout/Button";

export const Account = () => {
  return (
    <ScreenContainer style={{ gap: Theme.space.s }}>
      <Button mode="outlined" onPress={() => {}}>
        About the app
      </Button>
    </ScreenContainer>
  );
};
