import { describe, expect, it } from "vitest";
import { createPatchActivity, describeItemPatch } from "../src/domain/activity.js";

describe("request activity", () => {
  it("describes status and assignment changes in user-facing language", () => {
    expect(describeItemPatch({ status: "in_progress" })).toBe("Changed status to In progress.");
    expect(describeItemPatch({ assignee: "Maya Chen" })).toBe("Assigned request to Maya Chen.");
    expect(describeItemPatch({ assignee: null })).toBe("Removed the assignee.");
  });

  it("creates stable activity metadata when values are supplied", () => {
    const activity = createPatchActivity(
      { status: "waiting" },
      { id: "change-1", at: "2026-08-17T14:00:00Z", actor: "Alex Morgan" },
    );
    expect(activity).toEqual({
      id: "change-1",
      kind: "system",
      author: "Alex Morgan",
      body: "Changed status to Waiting.",
      at: "2026-08-17T14:00:00Z",
    });
  });
});
