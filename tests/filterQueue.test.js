import { describe, expect, it } from "vitest";
import { filterQueue, matchesQuery } from "../src/domain/filterQueue.js";
const items=[{subject:"Missing invoice",requester:{name:"Amina",email:"a@example.test"},team:"Billing",tags:["vip"],status:"new",priority:"high",unread:true},{subject:"Login loop",requester:{name:"Jon",email:"j@example.test"},team:"Trust",tags:["auth"],status:"waiting",priority:"urgent",unread:false}];
describe("filterQueue",()=>{it("matches across visible request fields",()=>{expect(matchesQuery(items[0],"vip")).toBe(true);expect(matchesQuery(items[1],"billing")).toBe(false)});it("combines structured filters",()=>{expect(filterQueue(items,{query:"",status:"new",team:"Billing",priority:"high",unreadOnly:true})).toEqual([items[0]])})});
