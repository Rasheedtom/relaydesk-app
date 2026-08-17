import { useEffect, useState } from "react";
import { searchWorkItems } from "../services/workItems.js";

export function useQueueSearch(items, query) {
  const [resultIds, setResultIds] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResultIds(null);
      setPending(false);
      return;
    }

    setPending(true);
    searchWorkItems(items, query).then((ids) => {
      setResultIds(ids);
      setPending(false);
    });
  }, [items, query]);

  return { resultIds, pending };
}
