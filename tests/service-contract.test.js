import { describe, expect, it } from "vitest";
import { persistBulkPatch, persistItemPatch, persistReadReceipt, searchWorkItems } from "../src/services/workItems.js";

describe("service contracts", () => {
  it("returns an explicit single-item persistence result", async () => {
    const result = await persistItemPatch("RD-1", { status: "waiting" });
    expect(result.id).toBe("RD-1");
    expect(result.patch.status).toBe("waiting");
    expect(result.savedAt).toBeTruthy();
  });

  it("persists opening an unread request as a read receipt", async () => {
    const result = await persistReadReceipt("RD-1");
    expect(result.id).toBe("RD-1");
    expect(result.patch).toEqual({ unread: false });
  });

  it("copies bulk ids", async () => {
    const ids = ["a", "b"];
    const result = await persistBulkPatch(ids, { status: "resolved" });
    ids.push("c");
    expect(result.ids).toEqual(["a", "b"]);
  });

  it("allows an in-flight search to be cancelled", async () => {
    const controller = new AbortController();
    const search = searchWorkItems([], "export", { signal: controller.signal });

    controller.abort();

    await expect(search).rejects.toMatchObject({ name: "AbortError" });
  });
});
