import React from "react";

export function ResultMeta({ count, selectedCount, pending, query }) {
  const searching = pending && query.trim();
  const resultText = searching ? "Searching requests…" : `${count} request${count === 1 ? "" : "s"}`;

  return <div className="result-meta">
    <span role="status" aria-live="polite" aria-atomic="true">{resultText}</span>
    {selectedCount > 0 && <span>{selectedCount} selected across views</span>}
  </div>;
}
