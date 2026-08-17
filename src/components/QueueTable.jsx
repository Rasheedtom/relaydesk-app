import React from "react";
import { useEffect, useRef } from "react";
import { QueueRow } from "./QueueRow.jsx";

export function QueueTable({ items, selectedIds, onToggle, onToggleVisible, onOpen }) {
  const selected = new Set(selectedIds);
  const visibleIds = items.map((item) => item.id);
  const selectedVisibleCount = visibleIds.filter((id) => selected.has(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someVisibleSelected;
  }, [someVisibleSelected]);

  return <div className="table-wrap"><table className="queue-table">
    <thead><tr><th className="select-cell"><input ref={selectAllRef} type="checkbox" aria-label="Select all visible requests" aria-checked={someVisibleSelected ? "mixed" : allVisibleSelected} checked={allVisibleSelected} onChange={() => onToggleVisible(visibleIds, allVisibleSelected)} /></th><th>Request</th><th>Priority</th><th>Status</th><th>Assignee</th><th>SLA</th><th>Updated</th></tr></thead>
    <tbody>{items.map((item) => <QueueRow key={item.id} item={item} selected={selected.has(item.id)} onToggle={onToggle} onOpen={onOpen} />)}</tbody>
  </table></div>;
}
