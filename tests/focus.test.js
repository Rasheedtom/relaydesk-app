import { describe, expect, it } from "vitest";
import { getReturnFocusTarget } from "../src/domain/focus.js";

describe("detail focus return", () => {
  it("returns the original trigger while it remains in the document", () => {
    const trigger = { isConnected: true };
    const fallback = { isConnected: true };
    expect(getReturnFocusTarget(trigger, fallback)).toBe(trigger);
  });

  it("falls back when an update removes the original queue row", () => {
    const trigger = { isConnected: false };
    const fallback = { isConnected: true };
    expect(getReturnFocusTarget(trigger, fallback)).toBe(fallback);
  });
});
