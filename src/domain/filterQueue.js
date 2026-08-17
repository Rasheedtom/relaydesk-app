function normalize(value) {
  return value.trim().toLocaleLowerCase();
}

export function matchesQuery(item, query) {
  const needle = normalize(query);
  if (!needle) return true;
  const haystack = [item.subject, item.requester.name, item.requester.email, item.team, ...item.tags]
    .join(" ")
    .toLocaleLowerCase();
  return haystack.includes(needle);
}

export function filterQueue(items, filters) {
  return items.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (filters.team !== "all" && item.team !== filters.team) return false;
    if (filters.priority !== "all" && item.priority !== filters.priority) return false;
    if (filters.assignee === "unassigned" && item.assignee) return false;
    if (filters.assignee && filters.assignee !== "all" && filters.assignee !== "unassigned" && item.assignee !== filters.assignee) return false;
    if (filters.unreadOnly && !item.unread) return false;
    if (filters.overdueOnly && (item.status === "resolved" || new Date(item.dueAt).getTime() >= Date.now())) return false;
    return matchesQuery(item, filters.query);
  });
}

export function getStatusCounts(items, filters) {
  const scoped = filterQueue(items, { ...filters, status: "all" });
  return {
    all: scoped.length,
    new: scoped.filter((item) => item.status === "new").length,
    in_progress: scoped.filter((item) => item.status === "in_progress").length,
    waiting: scoped.filter((item) => item.status === "waiting").length,
    resolved: scoped.filter((item) => item.status === "resolved").length,
  };
}
