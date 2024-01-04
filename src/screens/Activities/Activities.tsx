import { ScreenContainer } from "../../components/ScreenContainer";
import { useActivities } from "../../hooks/useActivities";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { ListItemActivity } from "../../components/ListItemActivity";
import { useState } from "react";

export const Activities = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useActivities({ page });
  const {
    data: nextPageData,
    isLoading: isLoadingNextPage,
    isError: isErrorNextPage,
  } = useActivities({ page: page + 1 });

  return (
    <ScreenContainer>
      {(isLoading || isLoadingNextPage) && <Loading />}
      {(isError || isErrorNextPage) && <Error />}

      {!isLoading && !isError && !isLoadingNextPage && !isErrorNextPage && (
        <>
          {data?.map((item) => (
            <ListItemActivity key={item.id} activity={item} />
          ))}
        </>
      )}
    </ScreenContainer>
  );
};
