import { useEffect, useState } from "react";
import { searchWorkItems } from "../services/workItems.js";

export function useQueueSearch(items, query) {
  const [resultIds, setResultIds] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResultIds(null);
      setPending(false);
      return undefined;
    }

    const controller = new AbortController();
    setPending(true);

    searchWorkItems(items, query, { signal: controller.signal })
      .then((ids) => {
        setResultIds(ids);
        setPending(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResultIds([]);
          setPending(false);
        }
      });

    return () => controller.abort();
  }, [items, query]);

  return { resultIds, pending };
}
