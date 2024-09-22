import { ReactElement, useEffect, useState } from "react";
import { VirtualizedList } from "react-native";
import { ITEMS_PER_PAGE } from "../../constants";

type Props<T> = {
  page: number;
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  onEndReached: (page: number) => void;
};

export const List = <T extends { id: number }>({
  page,
  data,
  renderItem,
  onEndReached,
}: Props<T>) => {
  const [reachedTheEnd, setReachedTheEnd] = useState(false);
  const [renderData, setRenderData] = useState<T[]>([]);

  useEffect(() => {
    if (!data?.length) {
      setReachedTheEnd(true);
    } else if (!renderData.find((item) => item.id === data[0].id)) {
      // this prevents to add the same objects again to the array
      setRenderData((currentRenderData) => [...currentRenderData, ...data]);
      setReachedTheEnd(false);
    }
  }, [data]);

  if (!renderData.length) {
    return null;
  }

  return (
    <VirtualizedList
      data={renderData}
      keyExtractor={(item: T) => String(item.id)}
      renderItem={({ item, index }) => renderItem(item, index)}
      onEndReached={() => {
        if (!reachedTheEnd) {
          onEndReached(page + 1);
        }
      }}
      onEndReachedThreshold={0.1}
      getItemCount={() => renderData.length}
      getItem={(data, index) => data[index]}
      initialNumToRender={ITEMS_PER_PAGE}
      maxToRenderPerBatch={ITEMS_PER_PAGE + 1}
      windowSize={ITEMS_PER_PAGE + 1}
      updateCellsBatchingPeriod={100}
    />
  );
};
