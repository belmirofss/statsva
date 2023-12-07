import { ScreenContainer } from "../../components/ScreenContainer";
import { useActivities } from "../../hooks/useActivities";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";

export const Activities = () => {
  const { data, isLoading, isError } = useActivities({ page: 1 });

  return (
    <ScreenContainer>
      {isLoading && <Loading />}
      {isError && <Error />}
    </ScreenContainer>
  );
};
