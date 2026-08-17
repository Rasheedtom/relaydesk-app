import { describe, expect, it } from "vitest";
import { getSearchSnapshot } from "../src/hooks/useQueueSearch.js";

describe("queue search state", () => {
  it("does not expose results from a previous query", () => {
    const stale = { query: "invoice", ids: ["RD-1041"], pending: false };
    expect(getSearchSnapshot(stale, "account")).toEqual({ resultIds: [], pending: true });
  });

  it("returns current results only after they belong to the active query", () => {
    const current = { query: "account", ids: ["RD-1048"], pending: false };
    expect(getSearchSnapshot(current, "account")).toEqual({ resultIds: ["RD-1048"], pending: false });
  });

  it("restores the full queue contract for an empty query", () => {
    const previous = { query: "account", ids: ["RD-1048"], pending: false };
    expect(getSearchSnapshot(previous, "  ")).toEqual({ resultIds: null, pending: false });
  });
});
