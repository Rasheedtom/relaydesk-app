import React from "react";
import { useCallback, useMemo, useReducer, useState } from "react";
import { seedWorkItems } from "./data/seed.js";
import { filterQueue } from "./domain/filterQueue.js";
import { sortQueue } from "./domain/sortQueue.js";
import { initialFilters, queueReducer } from "./domain/reducer.js";
import { persistBulkPatch, persistItemPatch } from "./services/workItems.js";
import { useQueueSearch } from "./hooks/useQueueSearch.js";
import { useDocumentTitle } from "./hooks/useDocumentTitle.js";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut.js";
import { AppShell } from "./components/AppShell.jsx";
import { Header } from "./components/Header.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { StatsStrip } from "./components/StatsStrip.jsx";
import { QueueToolbar } from "./components/QueueToolbar.jsx";
import { FilterBar } from "./components/FilterBar.jsx";
import { QueueTable } from "./components/QueueTable.jsx";
import { SelectionBar } from "./components/SelectionBar.jsx";
import { DetailPanel } from "./components/DetailPanel.jsx";
import { EmptyState } from "./components/EmptyState.jsx";
import { ToastRegion } from "./components/ToastRegion.jsx";
import { KeyboardHelp } from "./components/KeyboardHelp.jsx";

const initialState = { items: seedWorkItems, filters: initialFilters, sort: "recent", selectedIds: [], activeId: null, notice: "" };

export default function App() {
  const [state, dispatch] = useReducer(queueReducer, initialState);
  const [savingIds, setSavingIds] = useState([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const unreadCount = state.items.filter((item) => item.unread).length;
  useDocumentTitle(unreadCount);

  const { resultIds, pending } = useQueueSearch(state.items, state.filters.query);
  const visibleItems = useMemo(() => {
    const withoutQuery = filterQueue(state.items, { ...state.filters, query: "" });
    const searched = resultIds === null ? withoutQuery : withoutQuery.filter((item) => resultIds.includes(item.id));
    return sortQueue(searched, state.sort);
  }, [resultIds, state.filters, state.items, state.sort]);

  const counts = useMemo(() => ({
    all: state.items.length,
    new: state.items.filter((i) => i.status === "new").length,
    in_progress: state.items.filter((i) => i.status === "in_progress").length,
    waiting: state.items.filter((i) => i.status === "waiting").length,
    resolved: state.items.filter((i) => i.status === "resolved").length,
  }), [state.items]);

  const activeItem = state.items.find((item) => item.id === state.activeId) ?? null;
  const showNotice = useCallback((message) => { dispatch({ type: "notice/show", message }); window.setTimeout(() => dispatch({ type: "notice/clear" }), 2600); }, []);
  const closeDetail = useCallback(() => dispatch({ type: "detail/close" }), []);
  useKeyboardShortcut("Escape", closeDetail, { enabled: Boolean(state.activeId) });
  useKeyboardShortcut("?", () => setHelpOpen((open) => !open));

  async function patchOne(id, patch, message) {
    setSavingIds((ids) => [...ids, id]);
    dispatch({ type: "item/patch", id, patch });
    try { await persistItemPatch(id, patch); showNotice(message); }
    finally { setSavingIds((ids) => ids.filter((value) => value !== id)); }
  }

  async function patchSelected(status) {
    const ids = state.selectedIds;
    if (!ids.length) return;
    dispatch({ type: "items/patchMany", ids, patch: { status } });
    dispatch({ type: "selection/clear" });
    await persistBulkPatch(ids, { status });
    showNotice(`${ids.length} request${ids.length === 1 ? "" : "s"} updated.`);
  }

  function addNote(body) {
    if (!activeItem) return;
    const activity = { id: `note-${Date.now()}`, kind: "note", author: "Alex Morgan", body, at: new Date().toISOString() };
    dispatch({ type: "item/activity", id: activeItem.id, activity });
    showNotice("Internal note added.");
  }

  function toggleVisible(ids, allSelected) {
    const selected = new Set(state.selectedIds);
    ids.forEach((id) => allSelected ? selected.delete(id) : selected.add(id));
    dispatch({ type: "selection/setMany", ids: [...selected] });
  }

  function resetFilters() { dispatch({ type: "filters/reset" }); }

  return <AppShell
    header={<Header unreadCount={unreadCount} onToggleHelp={() => setHelpOpen((open) => !open)} />}
    sidebar={<Sidebar status={state.filters.status} counts={counts} onStatusChange={(value) => dispatch({ type: "filters/set", key: "status", value })} />}
    detail={<DetailPanel item={activeItem} saving={activeItem ? savingIds.includes(activeItem.id) : false} onClose={closeDetail} onAssignee={(assignee) => patchOne(activeItem.id, { assignee }, "Assignee updated.")} onStatus={(status) => patchOne(activeItem.id, { status }, "Status updated.")} onNote={addNote} />}
  >
    <div className="content-head"><div><p className="eyebrow">Workspace</p><h1>Request queue</h1><p>Prioritize incoming work without losing context.</p></div><StatsStrip items={state.items} /></div>
    <QueueToolbar query={state.filters.query} pending={pending} sort={state.sort} onQueryChange={(value) => dispatch({ type: "filters/set", key: "query", value })} onSortChange={(value) => dispatch({ type: "sort/set", value })} onReset={resetFilters} />
    <FilterBar filters={state.filters} onChange={(key, value) => dispatch({ type: "filters/set", key, value })} />
    <SelectionBar count={state.selectedIds.length} onStatus={patchSelected} onClear={() => dispatch({ type: "selection/clear" })} />
    <div className="result-meta"><span>{visibleItems.length} request{visibleItems.length === 1 ? "" : "s"}</span>{state.selectedIds.length > 0 && <span>{state.selectedIds.length} selected across views</span>}</div>
    {visibleItems.length ? <QueueTable items={visibleItems} selectedIds={state.selectedIds} onToggle={(id) => dispatch({ type: "selection/toggle", id })} onToggleVisible={toggleVisible} onOpen={(id) => dispatch({ type: "detail/open", id })} /> : <EmptyState onReset={resetFilters} />}
    <ToastRegion message={state.notice} />
    <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
  </AppShell>;
}
