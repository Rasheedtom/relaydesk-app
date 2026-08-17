import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "../src/App.jsx";
import { StatusBadge } from "../src/components/StatusBadge.jsx";

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
});
