import { describe, expect, it } from "vitest";
import { getSearchIndexKey, getSearchSnapshot } from "../src/hooks/useQueueSearch.js";

describe("queue search state", () => {
  it("does not expose results from a previous query", () => {
    const stale = { query: "invoice", ids: ["RD-1041"], pending: false };
    expect(getSearchSnapshot(stale, "account")).toEqual({ resultIds: [], pending: true, error: null });
  });

  it("returns current results only after they belong to the active query", () => {
    const current = { query: "account", ids: ["RD-1048"], pending: false };
    expect(getSearchSnapshot(current, "account")).toEqual({ resultIds: ["RD-1048"], pending: false, error: null });
  });

  it("restores the full queue contract for an empty query", () => {
    const previous = { query: "account", ids: ["RD-1048"], pending: false };
    expect(getSearchSnapshot(previous, "  ")).toEqual({ resultIds: null, pending: false, error: null });
  });
  it("surfaces an error only when it belongs to the active query", () => {
    const failed = { query: "invoice", ids: [], pending: false, error: "Search could not be completed." };
    expect(getSearchSnapshot(failed, "invoice").error).toBe("Search could not be completed.");
    expect(getSearchSnapshot(failed, "account").error).toBeNull();
  });

  it("keeps the search index stable for non-search field updates", () => {
    const item = { id: "RD-1", subject: "Invoice", requester: { name: "A", email: "a@example.test" }, team: "Billing", tags: ["customer"], status: "new", unread: true };
    const changed = { ...item, status: "resolved", unread: false, assignee: "Maya Chen" };
    expect(getSearchIndexKey([changed])).toBe(getSearchIndexKey([item]));
  });

  it("refreshes the search index when searchable content changes", () => {
    const item = { id: "RD-1", subject: "Invoice", requester: { name: "A", email: "a@example.test" }, team: "Billing", tags: ["customer"] };
    expect(getSearchIndexKey([{ ...item, subject: "Refund" }])).not.toBe(getSearchIndexKey([item]));
  });

});
