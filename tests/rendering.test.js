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

  it("connects the shortcuts trigger to its dialog state", () => {
    const header = renderToStaticMarkup(React.createElement(Header, { unreadCount: 3, helpOpen: true, onToggleHelp() {} }));
    const help = renderToStaticMarkup(React.createElement(KeyboardHelp, { open: true, onClose() {} }));
    expect(header).toContain('aria-expanded="true"');
    expect(header).toContain('aria-controls="keyboard-help"');
    expect(help).toContain('id="keyboard-help"');
    expect(help).toContain('Close the active panel');
  });

});
