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
    if (filters.unreadOnly && !item.unread) return false;
    return matchesQuery(item, filters.query);
  });
}
