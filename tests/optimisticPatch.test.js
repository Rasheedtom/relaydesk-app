import { describe, expect, it } from "vitest";
import { snapshotPatchFields } from "../src/domain/optimisticPatch.js";

describe("optimistic patch snapshots", () => {
  it("captures only fields that an optimistic update can overwrite", () => {
    const item = { id: "RD-1", status: "new", assignee: "Maya Chen", unread: true };
    expect(snapshotPatchFields(item, { status: "waiting", assignee: null })).toEqual({ status: "new", assignee: "Maya Chen" });
  });

  it("returns an empty snapshot when the request no longer exists", () => {
    expect(snapshotPatchFields(undefined, { status: "waiting" })).toEqual({});
  });
});
