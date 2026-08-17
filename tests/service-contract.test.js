import { describe, expect, it } from "vitest";
import { persistBulkPatch, persistItemPatch } from "../src/services/workItems.js";
describe("service contracts",()=>{it("returns an explicit single-item persistence result",async()=>{const result=await persistItemPatch("RD-1",{status:"waiting"});expect(result.id).toBe("RD-1");expect(result.patch.status).toBe("waiting");expect(result.savedAt).toBeTruthy()});it("copies bulk ids",async()=>{const ids=["a","b"];const result=await persistBulkPatch(ids,{status:"resolved"});ids.push("c");expect(result.ids).toEqual(["a","b"])})});
