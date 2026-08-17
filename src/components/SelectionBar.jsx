import React from "react";

export function SelectionBar({ count, saving, onStatus, onClear }) {
  if (!count) return null;
  return <div className="selection-bar" role="region" aria-label="Bulk actions">
    <strong>{count} selected</strong>
    {saving && <span role="status">Updating…</span>}
    <span className="selection-divider" />
    <button disabled={saving} onClick={() => onStatus("in_progress")}>Mark in progress</button>
    <button disabled={saving} onClick={() => onStatus("waiting")}>Mark waiting</button>
    <button disabled={saving} onClick={() => onStatus("resolved")}>Resolve</button>
    <button className="quiet" disabled={saving} onClick={onClear}>Clear</button>
  </div>;
}
