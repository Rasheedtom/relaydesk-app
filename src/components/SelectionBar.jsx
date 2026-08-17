import React from "react";
export function SelectionBar({ count, onStatus, onClear }) {
  if (!count) return null;
  return <div className="selection-bar" role="region" aria-label="Bulk actions"><strong>{count} selected</strong><span className="selection-divider" /><button onClick={() => onStatus("in_progress")}>Mark in progress</button><button onClick={() => onStatus("waiting")}>Mark waiting</button><button onClick={() => onStatus("resolved")}>Resolve</button><button className="quiet" onClick={onClear}>Clear</button></div>;
}
