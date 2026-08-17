import { describe, expect, it } from "vitest";
import { filterQueue, matchesQuery } from "../src/domain/filterQueue.js";

const items = [
  { subject: "Missing invoice", requester: { name: "Amina", email: "a@example.test" }, team: "Billing", tags: ["vip"], status: "new", priority: "high", assignee: null, unread: true },
  { subject: "Login loop", requester: { name: "Jon", email: "j@example.test" }, team: "Trust", tags: ["auth"], status: "waiting", priority: "urgent", assignee: "Maya Chen", unread: false },
];

describe("filterQueue", () => {
  it("matches across visible request fields", () => {
    expect(matchesQuery(items[0], "vip")).toBe(true);
    expect(matchesQuery(items[1], "billing")).toBe(false);
  });

  it("combines structured filters", () => {
    expect(filterQueue(items, { query: "", status: "new", team: "Billing", priority: "high", assignee: "all", unreadOnly: true })).toEqual([items[0]]);
  });

  it("filters by named and unassigned ownership", () => {
    const base = { query: "", status: "all", team: "all", priority: "all", unreadOnly: false };
    expect(filterQueue(items, { ...base, assignee: "unassigned" })).toEqual([items[0]]);
    expect(filterQueue(items, { ...base, assignee: "Maya Chen" })).toEqual([items[1]]);
  });
});
