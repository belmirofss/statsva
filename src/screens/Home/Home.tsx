import { ScreenContainer } from "../../components/ScreenContainer";
import { useAthleteStats } from "../../hooks/useStats";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";

export const Home = () => {
  const { data, isLoading, isError } = useAthleteStats();

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
    </ScreenContainer>
  );
};
