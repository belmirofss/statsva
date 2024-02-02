import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Theme } from "../theme";
import { AboutTheApp } from "../components/AboutTheApp";

export const Account = () => {
  return (
    <ScreenContainer style={{ gap: Theme.space.s }}>
      <AboutTheApp />
    </ScreenContainer>
  );
};
