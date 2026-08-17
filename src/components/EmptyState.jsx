import React from "react";
export function EmptyState({ onReset }) {
  return <div className="empty-state"><div aria-hidden="true">⌕</div><h2>No requests match</h2><p>Try a broader search or clear the queue filters.</p><button className="button" onClick={onReset}>Clear filters</button></div>;
}
