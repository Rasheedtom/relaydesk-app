import React from "react";

export function EmptyState({ query = "", hasFilters = false, onClearSearch, onReset }) {
  const normalizedQuery = query.trim();
  if (normalizedQuery) {
    return <div className="empty-state"><div aria-hidden="true">⌕</div><h2>No search results</h2><p>No requests match “{normalizedQuery}” within the current queue filters.</p><button className="button" onClick={onClearSearch}>Clear search</button></div>;
  }
  if (hasFilters) {
    return <div className="empty-state"><div aria-hidden="true">⌕</div><h2>No requests match</h2><p>Try a broader combination of queue filters.</p><button className="button" onClick={onReset}>Clear filters</button></div>;
  }
  return <div className="empty-state"><div aria-hidden="true">✓</div><h2>No requests yet</h2><p>New requests will appear here when they arrive.</p></div>;
}
