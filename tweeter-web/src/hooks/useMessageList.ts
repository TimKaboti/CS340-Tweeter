import { useState } from "react";

export const useMessageList = <T,>() => {
  const [items, setItems] = useState<T[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<T | null>(null);

  const addItems = (newItems: T[]) => {
    setItems((prev) => [...prev, ...newItems]);
  };

  const reset = () => {
    setItems([]);
    setLastItem(null);
    setHasMoreItems(true);
  };

  return {
    items,
    hasMoreItems,
    lastItem,
    setHasMoreItems,
    setLastItem,
    addItems,
    reset,
  };
};
