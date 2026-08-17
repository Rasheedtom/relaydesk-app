import React from "react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { seedWorkItems } from "./data/seed.js";
import { filterQueue } from "./domain/filterQueue.js";
import { sortQueue } from "./domain/sortQueue.js";
import { initialFilters, queueReducer } from "./domain/reducer.js";
import { createPatchActivity } from "./domain/activity.js";
import { snapshotPatchFields, snapshotPatchesById } from "./domain/optimisticPatch.js";
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
import { SearchPendingState } from "./components/SearchPendingState.jsx";
import { ToastRegion } from "./components/ToastRegion.jsx";
import { KeyboardHelp } from "./components/KeyboardHelp.jsx";

const initialState = { items: seedWorkItems, filters: initialFilters, sort: "recent", selectedIds: [], activeId: null, notice: "" };

export default function App() {
  const [state, dispatch] = useReducer(queueReducer, initialState);
  const [savingIds, setSavingIds] = useState([]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState({});
  const noticeTimerRef = useRef(null);
  const detailTriggerRef = useRef(null);
  const helpTriggerRef = useRef(null);
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
  const hasFacetFilters = state.filters.status !== "all" || state.filters.team !== "all" || state.filters.priority !== "all" || state.filters.assignee !== "all" || state.filters.unreadOnly;
  const activeNoteDraft = activeItem ? noteDrafts[activeItem.id] ?? "" : "";
  const showNotice = useCallback((message) => {
    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
    dispatch({ type: "notice/show", message });
    noticeTimerRef.current = window.setTimeout(() => {
      dispatch({ type: "notice/clear" });
      noticeTimerRef.current = null;
    }, 2600);
  }, []);
  useEffect(() => () => {
    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
  }, []);
  const closeDetail = useCallback(() => {
    dispatch({ type: "detail/close" });
    window.requestAnimationFrame(() => detailTriggerRef.current?.focus());
  }, []);
  const openDetail = useCallback((id, trigger) => {
    detailTriggerRef.current = trigger;
    dispatch({ type: "detail/open", id });
  }, []);
  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    window.requestAnimationFrame(() => helpTriggerRef.current?.focus());
  }, []);
  const toggleHelp = useCallback((trigger) => {
    setHelpOpen((open) => {
      if (open) return false;
      helpTriggerRef.current = trigger ?? document.activeElement;
      return true;
    });
  }, []);
  useKeyboardShortcut("Escape", closeDetail, { enabled: Boolean(state.activeId) && !helpOpen });
  useKeyboardShortcut("?", () => toggleHelp());

  async function patchOne(id, patch, message) {
    const item = state.items.find((candidate) => candidate.id === id);
    const rollbackPatch = snapshotPatchFields(item, patch);
    setSavingIds((ids) => [...ids, id]);
    dispatch({ type: "item/patch", id, patch });
    try {
      await persistItemPatch(id, patch);
      const activity = createPatchActivity(patch);
      if (activity.body) dispatch({ type: "item/activity", id, activity });
      showNotice(message);
    } catch {
      dispatch({ type: "item/patch", id, patch: rollbackPatch });
      showNotice("Changes could not be saved. Try again.");
    } finally {
      setSavingIds((ids) => ids.filter((value) => value !== id));
    }
  }

  async function patchSelected(status) {
    const ids = state.selectedIds.filter((id) => state.items.find((item) => item.id === id)?.status !== status);
    if (!state.selectedIds.length || bulkSaving) return;
    if (!ids.length) {
      dispatch({ type: "selection/clear" });
      showNotice("Selected requests already have that status.");
      return;
    }
    const rollbackEntries = snapshotPatchesById(state.items, ids, { status });
    setBulkSaving(true);
    dispatch({ type: "items/patchMany", ids, patch: { status } });
    try {
      await persistBulkPatch(ids, { status });
      const at = new Date().toISOString();
      dispatch({
        type: "items/activityMany",
        entries: ids.map((id) => ({ id, activity: createPatchActivity({ status }, { at, id: `bulk-${Date.now()}-${id}` }) })),
      });
      dispatch({ type: "selection/clear" });
      showNotice(`${ids.length} request${ids.length === 1 ? "" : "s"} updated.`);
    } catch {
      dispatch({ type: "items/restoreMany", entries: rollbackEntries });
      showNotice("Bulk update could not be saved. Try again.");
    } finally {
      setBulkSaving(false);
    }
  }

  function addNote(body) {
    if (!activeItem) return;
    const activity = { id: `note-${Date.now()}`, kind: "note", author: "Alex Morgan", body, at: new Date().toISOString() };
    dispatch({ type: "item/activity", id: activeItem.id, activity });
    setNoteDrafts((drafts) => {
      const next = { ...drafts };
      delete next[activeItem.id];
      return next;
    });
    showNotice("Internal note added.");
  }

  function updateNoteDraft(value) {
    if (!activeItem) return;
    setNoteDrafts((drafts) => ({ ...drafts, [activeItem.id]: value }));
  }

  function toggleVisible(ids, allSelected) {
    const selected = new Set(state.selectedIds);
    ids.forEach((id) => allSelected ? selected.delete(id) : selected.add(id));
    dispatch({ type: "selection/setMany", ids: [...selected] });
  }

  function resetFilters() { dispatch({ type: "filters/reset" }); }

  return <AppShell
    header={<Header unreadCount={unreadCount} helpOpen={helpOpen} onToggleHelp={toggleHelp} />}
    sidebar={<Sidebar status={state.filters.status} counts={counts} onStatusChange={(value) => dispatch({ type: "filters/set", key: "status", value })} />}
    detail={<DetailPanel item={activeItem} saving={activeItem ? savingIds.includes(activeItem.id) : false} noteDraft={activeNoteDraft} onNoteDraft={updateNoteDraft} onClose={closeDetail} onAssignee={(assignee) => patchOne(activeItem.id, { assignee }, "Assignee updated.")} onStatus={(status) => patchOne(activeItem.id, { status }, "Status updated.")} onNote={addNote} />}
  >
    <div className="content-head"><div><p className="eyebrow">Workspace</p><h1>Request queue</h1><p>Prioritize incoming work without losing context.</p></div><StatsStrip items={state.items} /></div>
    <QueueToolbar query={state.filters.query} pending={pending} sort={state.sort} onQueryChange={(value) => dispatch({ type: "filters/set", key: "query", value })} onSortChange={(value) => dispatch({ type: "sort/set", value })} onReset={resetFilters} />
    <FilterBar filters={state.filters} onChange={(key, value) => dispatch({ type: "filters/set", key, value })} />
    <SelectionBar count={state.selectedIds.length} saving={bulkSaving} onStatus={patchSelected} onClear={() => dispatch({ type: "selection/clear" })} />
    <div className="result-meta"><span>{pending && state.filters.query.trim() ? "Searching requests…" : `${visibleItems.length} request${visibleItems.length === 1 ? "" : "s"}`}</span>{state.selectedIds.length > 0 && <span>{state.selectedIds.length} selected across views</span>}</div>
    {pending && state.filters.query.trim() ? <SearchPendingState /> : visibleItems.length ? <QueueTable items={visibleItems} selectedIds={state.selectedIds} onToggle={(id) => dispatch({ type: "selection/toggle", id })} onToggleVisible={toggleVisible} onOpen={openDetail} /> : <EmptyState query={state.filters.query} hasFilters={hasFacetFilters} onClearSearch={() => dispatch({ type: "filters/set", key: "query", value: "" })} onReset={resetFilters} />}
    <ToastRegion message={state.notice} />
    <KeyboardHelp open={helpOpen} onClose={closeHelp} />
  </AppShell>;
}
