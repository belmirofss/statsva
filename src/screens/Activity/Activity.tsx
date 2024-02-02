import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { ScreenContainer } from "../../components/ScreenContainer";
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
