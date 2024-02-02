import { Error } from "../../components/layout/Error";
import { Loading } from "../../components/layout/Loading";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useActivity } from "../../hooks/useActivity";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ActivityCard } from "./ActivityCard";

type Params = {
  Activity: {
    id: number;
  };
};

export const Activity = () => {
  const { params } = useRoute<RouteProp<Params, "Activity">>();
  const { data: activity, isLoading, isError } = useActivity({ id: params.id });

  return (
    <ScreenContainer>
      {isError && <Error />}
      {isLoading && <Loading />}
      {activity && <ActivityCard activity={activity} />}
    </ScreenContainer>
  );
};
