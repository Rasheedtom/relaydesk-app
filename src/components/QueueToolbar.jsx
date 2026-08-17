import React from "react";
import { useRef } from "react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut.js";

export function QueueToolbar({ query, pending, sort, onQueryChange, onSortChange, onReset }) {
  const searchRef = useRef(null);
  useKeyboardShortcut("/", () => searchRef.current?.focus());
  return <div className="queue-toolbar">
    <label className="search-field">
      <span className="sr-only">Search requests</span>
      <span aria-hidden="true">⌕</span>
      <input ref={searchRef} value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search requests, people, tags…" />
      {pending && <span className="search-progress" role="status">Searching…</span>}
    </label>
    <label className="compact-field"><span>Sort</span><select value={sort} onChange={(e) => onSortChange(e.target.value)}><option value="recent">Recently updated</option><option value="oldest">Oldest updated</option><option value="priority">Priority</option><option value="due">SLA due</option></select></label>
    <button className="button ghost" onClick={onReset}>Reset</button>
  </div>;
}
