import React from "react";
import { QueueRow } from "./QueueRow.jsx";

export function QueueTable({ items, selectedIds, onToggle, onToggleVisible, onOpen }) {
  const selected = new Set(selectedIds);
  const visibleIds = items.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  return <div className="table-wrap"><table className="queue-table">
    <thead><tr><th className="select-cell"><input type="checkbox" aria-label="Select all visible requests" checked={allVisibleSelected} onChange={() => onToggleVisible(visibleIds, allVisibleSelected)} /></th><th>Request</th><th>Priority</th><th>Status</th><th>Assignee</th><th>SLA</th><th>Updated</th></tr></thead>
    <tbody>{items.map((item) => <QueueRow key={item.id} item={item} selected={selected.has(item.id)} onToggle={onToggle} onOpen={onOpen} />)}</tbody>
  </table></div>;
}
