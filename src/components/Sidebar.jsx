import React from "react";
const views = [
  ["all", "All requests"], ["new", "New"], ["in_progress", "In progress"], ["waiting", "Waiting"], ["resolved", "Resolved"]
];

export function Sidebar({ status, counts, onStatusChange }) {
  return <aside className="sidebar" aria-label="Queue views">
    <p className="eyebrow">Views</p>
    <nav>{views.map(([value, label]) => <button key={value} className={status === value ? "nav-item active" : "nav-item"} onClick={() => onStatusChange(value)} aria-current={status === value ? "page" : undefined}><span>{label}</span><span className="nav-count">{counts[value] ?? 0}</span></button>)}</nav>
    <div className="sidebar-note"><strong>Tip</strong><span>Press <kbd>/</kbd> to focus search.</span></div>
  </aside>;
}
