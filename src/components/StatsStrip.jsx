import React from "react";
export function StatsStrip({ items }) {
  const urgent = items.filter((item) => item.priority === "urgent" && item.status !== "resolved").length;
  const unassigned = items.filter((item) => !item.assignee && item.status !== "resolved").length;
  const waiting = items.filter((item) => item.status === "waiting").length;
  return <section className="stats-strip" aria-label="Queue summary">
    <div><span>Open</span><strong>{items.filter((item) => item.status !== "resolved").length}</strong></div>
    <div><span>Urgent</span><strong>{urgent}</strong></div>
    <div><span>Unassigned</span><strong>{unassigned}</strong></div>
    <div><span>Waiting</span><strong>{waiting}</strong></div>
  </section>;
}
