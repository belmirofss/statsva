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
import { AdBanner } from "../../components/AdBanner";
import { AD_BANNER_ACTIVITIES_UNIT_ID } from "../../constants";

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
          renderItem={(item, index) => (
            <View>
              <View
                style={{
                  marginBottom: Theme.space.xl,
                }}
              >
                <ListItemActivity activity={item} />
              </View>

              {index === 0 && (
                <View style={{ marginBottom: Theme.space.xl }}>
                  <AdBanner adUnitId={AD_BANNER_ACTIVITIES_UNIT_ID} />
                </View>
              )}
            </View>
          )}
          onEndReached={setPage}
        />
      )}

      {isLoading && <Loading mode={page === 1 ? "full" : "local"} />}
    </ScreenContainer>
  );
};
