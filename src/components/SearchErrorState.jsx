import React from "react";

export function SearchErrorState({ onRetry }) {
  return <div className="search-error-state" role="alert">
    <strong>Search is temporarily unavailable</strong>
    <span>Your filters are still applied. Retry the current search when you are ready.</span>
    <button className="button" onClick={onRetry}>Retry search</button>
  </div>;
}
