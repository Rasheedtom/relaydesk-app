const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

export function sortQueue(items, sort) {
  const next = [...items];
  if (sort === "oldest") return next.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  if (sort === "priority") {
    return next.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || new Date(a.dueAt) - new Date(b.dueAt));
  }
  if (sort === "due") return next.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  return next.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}
