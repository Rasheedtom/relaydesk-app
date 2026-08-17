const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

function byId(a, b) {
  return a.id.localeCompare(b.id);
}

export function sortQueue(items, sort) {
  const next = [...items];
  if (sort === "oldest") return next.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt) || byId(a, b));
  if (sort === "priority") {
    return next.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || new Date(a.dueAt) - new Date(b.dueAt) || byId(a, b));
  }
  if (sort === "due") return next.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt) || byId(a, b));
  return next.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) || byId(a, b));
}
