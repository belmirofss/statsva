import { ScreenContainer } from "../../components/ScreenContainer";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useAthleteStats } from "../../hooks/useAthleteStats";

export const Home = () => {
  const { data, isLoading, isError } = useAthleteStats();

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
    </ScreenContainer>
  );
};
