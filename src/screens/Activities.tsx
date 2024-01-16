import { ScreenContainer } from "../components/ScreenContainer";
import { useActivities } from "../hooks/useActivities";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { List } from "../components/List";
import { useState } from "react";
import { ListItemActivity } from "../components/ListItemActivity";
import { SummaryActivity } from "../types";

export const Activities = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useActivities({ page });

  return (
    <ScreenContainer disableScrollView>
      {isError && <Error />}

      {!isError && (
        <List<SummaryActivity>
          page={page}
          data={data || []}
          renderItem={(item) => <ListItemActivity activity={item} />}
          onEndReached={setPage}
        />
      )}

      {isLoading && <Loading mode={page === 1 ? "full" : "local"} />}
    </ScreenContainer>
  );
};
