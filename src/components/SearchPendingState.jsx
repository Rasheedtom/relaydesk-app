import React from "react";

export function SearchPendingState() {
  return <div className="search-pending-state" role="status" aria-live="polite">
    <strong>Searching requests…</strong>
    <span>Checking the current queue for matching requests.</span>
  </div>;
}
