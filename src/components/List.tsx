import { ReactElement, useEffect, useState } from "react";
import { VirtualizedList } from "react-native";
import { ITEMS_PER_PAGE } from "../constants";

type Props<T> = {
  page: number;
  data: T[];
  renderItem: (item: T) => ReactElement;
  onEndReached: (page: number) => void;
};

export const List = <T extends { id: number }>({
  page,
  data,
  renderItem,
  onEndReached,
}: Props<T>) => {
  const [endedUp, setEndedUp] = useState(false);
  const [renderData, setRenderData] = useState<T[]>([]);

  useEffect(() => {
    if (!data?.length) {
      setEndedUp(true);
    } else if (!renderData.find((item) => item.id === data[0].id)) {
      // this prevents to add the same objects again to the array
      setRenderData((currentRenderData) => [...currentRenderData, ...data]);
      setEndedUp(false);
    }
  }, [data]);

  if (!renderData.length) {
    return null;
  }

  return (
    <VirtualizedList
      initialNumToRender={ITEMS_PER_PAGE}
      data={renderData}
      keyExtractor={(item: T) => String(item.id)}
      renderItem={({ item }) => renderItem(item)}
      onEndReached={() => {
        if (!endedUp) {
          onEndReached(page + 1);
        }
      }}
      onEndReachedThreshold={0.1}
      getItemCount={() => renderData.length}
      getItem={(data, index) => data[index]}
    />
  );
};
