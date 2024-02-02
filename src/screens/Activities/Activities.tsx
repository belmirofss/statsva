import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useActivities } from "../../hooks/useActivities";
import { Loading } from "../../components/layout/Loading";
import { Error } from "../../components/layout/Error";
import { List } from "../../components/layout/List";
import { useState } from "react";
import { ListItemActivity } from "./ListItemActivity";
import { SummaryActivity } from "../../types";
import { View } from "react-native";
import { Theme } from "../../theme";

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
          renderItem={(item) => (
            <View style={{ marginBottom: Theme.space.xl }}>
              <ListItemActivity activity={item} />
            </View>
          )}
          onEndReached={setPage}
        />
      )}

      {isLoading && <Loading mode={page === 1 ? "full" : "local"} />}
    </ScreenContainer>
  );
};
