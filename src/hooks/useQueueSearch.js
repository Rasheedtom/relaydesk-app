import { useCallback, useEffect, useState } from "react";
import { searchWorkItems } from "../services/workItems.js";

export function getSearchSnapshot(searchState, query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return { resultIds: null, pending: false, error: null };
  const current = searchState.query === normalizedQuery;
  return {
    resultIds: current ? searchState.ids : [],
    pending: !current || searchState.pending,
    error: current ? searchState.error ?? null : null,
  };
}

export function getSearchIndexKey(items) {
  return items.map((item) => [
    item.id,
    item.subject,
    item.requester.name,
    item.requester.email,
    item.team,
    ...item.tags,
  ].join("\u001f")).join("\u001e");
}

export function useQueueSearch(items, query) {
  const normalizedQuery = query.trim();
  const searchIndexKey = getSearchIndexKey(items);
  const [retryVersion, setRetryVersion] = useState(0);
  const [searchState, setSearchState] = useState({ query: "", ids: null, pending: false, error: null });
  const retry = useCallback(() => setRetryVersion((version) => version + 1), []);

  useEffect(() => {
    if (!normalizedQuery) {
      setSearchState({ query: "", ids: null, pending: false, error: null });
      return undefined;
    }

    const controller = new AbortController();
    setSearchState((current) => ({
      query: normalizedQuery,
      ids: current.query === normalizedQuery ? current.ids : [],
      pending: true,
      error: null,
    }));

    searchWorkItems(items, normalizedQuery, { signal: controller.signal })
      .then((ids) => setSearchState({ query: normalizedQuery, ids, pending: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setSearchState({ query: normalizedQuery, ids: [], pending: false, error: "Search could not be completed." });
        }
      });

    return () => controller.abort();
  }, [searchIndexKey, normalizedQuery, retryVersion]);

  return { ...getSearchSnapshot(searchState, normalizedQuery), retry };
}
