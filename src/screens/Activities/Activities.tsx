import { ScreenContainer } from "../../components/ScreenContainer";
import { useActivities } from "../../hooks/useActivities";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { List } from "../../components/List";
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
