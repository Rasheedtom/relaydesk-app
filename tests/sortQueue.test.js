import { describe, expect, it } from "vitest";
import { sortQueue } from "../src/domain/sortQueue.js";
const items=[{id:"a",priority:"normal",updatedAt:"2026-08-10T10:00:00Z",dueAt:"2026-08-19T10:00:00Z"},{id:"b",priority:"urgent",updatedAt:"2026-08-11T10:00:00Z",dueAt:"2026-08-20T10:00:00Z"},{id:"c",priority:"high",updatedAt:"2026-08-09T10:00:00Z",dueAt:"2026-08-18T10:00:00Z"}];
describe("sortQueue",()=>{it("sorts recent without mutating input",()=>{const result=sortQueue(items,"recent");expect(result.map(i=>i.id)).toEqual(["b","a","c"]);expect(items.map(i=>i.id)).toEqual(["a","b","c"])});it("puts urgent work first",()=>expect(sortQueue(items,"priority")[0].id).toBe("b"));it("sorts by due time",()=>expect(sortQueue(items,"due").map(i=>i.id)).toEqual(["c","a","b"]))});
