import { ScreenContainer } from "../components/ScreenContainer";
import { Theme } from "../theme";
import { AboutTheApp } from "../components/AboutTheApp";

export const Account = () => {
  return (
    <ScreenContainer style={{ gap: Theme.space.s }}>
      <AboutTheApp />
    </ScreenContainer>
  );
};
