import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "../src/App.jsx";
import { StatusBadge } from "../src/components/StatusBadge.jsx";
import { QueueTable } from "../src/components/QueueTable.jsx";
import { DetailPanel } from "../src/components/DetailPanel.jsx";
import { SelectionBar } from "../src/components/SelectionBar.jsx";
import { Header } from "../src/components/Header.jsx";
import { KeyboardHelp } from "../src/components/KeyboardHelp.jsx";
import { NoteComposer, MAX_NOTE_LENGTH } from "../src/components/NoteComposer.jsx";
import { QueueToolbar } from "../src/components/QueueToolbar.jsx";
import { EmptyState } from "../src/components/EmptyState.jsx";
import { FilterBar } from "../src/components/FilterBar.jsx";
import { seedWorkItems } from "../src/data/seed.js";

describe("React rendering", () => {
  it("renders status text rather than relying on color", () => {
    const html = renderToStaticMarkup(React.createElement(StatusBadge, { status: "in_progress" }));
    expect(html).toContain("In progress");
  });

  it("renders the queue shell and visible request controls", () => {
    const html = renderToStaticMarkup(React.createElement(App));
    expect(html).toContain("Request queue");
    expect(html).toContain("Select all visible requests");
    expect(html).toContain("Search requests");
  });
  it("announces partial visible selection as mixed", () => {
    const items = [
      { id: "RD-1", subject: "First", unread: false, requester: { name: "A", email: "a@example.test" }, team: "Support", priority: "normal", status: "new", assignee: null, dueAt: "2026-08-20T00:00:00Z", updatedAt: "2026-08-17T00:00:00Z" },
      { id: "RD-2", subject: "Second", unread: false, requester: { name: "B", email: "b@example.test" }, team: "Support", priority: "normal", status: "new", assignee: null, dueAt: "2026-08-20T00:00:00Z", updatedAt: "2026-08-17T00:00:00Z" },
    ];
    const html = renderToStaticMarkup(React.createElement(QueueTable, { items, selectedIds: ["RD-1"], onToggle() {}, onToggleVisible() {}, onOpen() {} }));
    expect(html).toContain('aria-checked="mixed"');
  });

  it("labels request details as a dialog", () => {
    const html = renderToStaticMarkup(React.createElement(DetailPanel, {
      item: seedWorkItems[0],
      saving: false,
      noteDraft: "",
      onNoteDraft() {},
      onClose() {},
      onAssignee() {},
      onStatus() {},
      onNote() {},
    }));
    expect(html).toContain('role="dialog"');
    expect(html).toContain(`aria-labelledby="detail-title-${seedWorkItems[0].id}"`);
  });

  it("disables bulk actions while an update is being saved", () => {
    const html = renderToStaticMarkup(React.createElement(SelectionBar, { count: 2, saving: true, onStatus() {}, onClear() {} }));
    expect(html).toContain("Updating…");
    expect((html.match(/disabled/g) ?? []).length).toBe(4);
  });

  it("offers a search-specific recovery when a query has no results", () => {
    const html = renderToStaticMarkup(React.createElement(EmptyState, { query: "invoice", hasFilters: true, onClearSearch() {}, onReset() {} }));
    expect(html).toContain("No search results");
    expect(html).toContain("Clear search");
    expect(html).not.toContain("Clear filters");
  });

  it("does not suggest clearing filters for a genuinely empty queue", () => {
    const html = renderToStaticMarkup(React.createElement(EmptyState, { query: "", hasFilters: false, onClearSearch() {}, onReset() {} }));
    expect(html).toContain("No requests yet");
    expect(html).not.toContain("Clear filters");
  });

  it("offers a labeled way to clear an active search", () => {
    const html = renderToStaticMarkup(React.createElement(QueueToolbar, { query: "invoice", pending: false, sort: "recent", onQueryChange() {}, onSortChange() {}, onReset() {} }));
    expect(html).toContain('aria-label="Clear search"');
    expect(html).toContain('value="invoice"');
  });

  it("exposes machine-readable request timestamps", () => {
    const item = seedWorkItems[0];
    const html = renderToStaticMarkup(React.createElement(QueueTable, { items: [item], selectedIds: [], onToggle() {}, onToggleVisible() {}, onOpen() {} }));
    expect(html).toContain(`dateTime="${item.dueAt}"`);
    expect(html).toContain(`dateTime="${item.updatedAt}"`);
  });

  it("enforces and describes the internal note character limit", () => {
    const html = renderToStaticMarkup(React.createElement(NoteComposer, { value: "Draft", onChange() {}, onSubmit() {}, disabled: false }));
    expect(html).toContain(`maxLength="${MAX_NOTE_LENGTH}"`);
    expect(html).toContain('aria-describedby="internal-note-count"');
    expect(html).toContain(`5/${MAX_NOTE_LENGTH}`);
  });

  it("connects the shortcuts trigger to its dialog state", () => {
    const header = renderToStaticMarkup(React.createElement(Header, { unreadCount: 3, helpOpen: true, onToggleHelp() {} }));
    const help = renderToStaticMarkup(React.createElement(KeyboardHelp, { open: true, onClose() {} }));
    expect(header).toContain('aria-expanded="true"');
    expect(header).toContain('aria-controls="keyboard-help"');
    expect(help).toContain('id="keyboard-help"');
    expect(help).toContain('Close the active panel');
  });

  it("groups queue filters with a semantic legend", () => {
    const html = renderToStaticMarkup(React.createElement(FilterBar, { filters: { query: "", status: "all", team: "all", priority: "all", unreadOnly: false }, onChange() {} }));
    expect(html).toContain("<fieldset");
    expect(html).toContain("Queue filters</legend>");
  });

});
