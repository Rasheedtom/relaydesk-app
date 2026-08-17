import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "../src/App.jsx";
import { StatusBadge } from "../src/components/StatusBadge.jsx";
import { QueueTable } from "../src/components/QueueTable.jsx";

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

});
