import { ScreenContainer } from "../../components/ScreenContainer";
import { useActivities, ACTIVITIES_PER_PAGE } from "../../hooks/useActivities";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { ListItemActivity } from "../../components/ListItemActivity";
import { useEffect, useState } from "react";
import { SummaryActivity } from "../../types";
import { VirtualizedList } from "react-native";

export const Activities = () => {
  const [page, setPage] = useState(1);
  const [renderData, setRenderData] = useState<SummaryActivity[]>([]);
  const [endedUp, setEndedUp] = useState(false);

  const { data, isLoading, isError } = useActivities({ page });

  useEffect(() => {
    if (!data?.length) {
      setEndedUp(true);
    } else if (!renderData.find((item) => item.id === data[0].id)) {
      // this prevents to add the same objects again to the array
      setRenderData((currentRenderData) => [...currentRenderData, ...data]);
      setEndedUp(false);
    }
  }, [data]);

  return (
    <ScreenContainer disableScrollView>
      {isError && <Error />}

      {!isError && (
        <VirtualizedList
          initialNumToRender={ACTIVITIES_PER_PAGE}
          keyExtractor={(item: SummaryActivity) => `activity_${item.id}`}
          data={renderData}
          renderItem={({ item }) => <ListItemActivity activity={item} />}
          onEndReached={() => {
            if (!endedUp) {
              setPage((currentPage) => currentPage + 1);
            }
          }}
          onEndReachedThreshold={0.1}
          getItemCount={() => renderData.length}
          getItem={(data, index) => data[index]}
        />
      )}

      {isLoading && <Loading mode={page === 1 ? "full" : "local"} />}
    </ScreenContainer>
  );
};
