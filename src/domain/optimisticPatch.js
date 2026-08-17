export function snapshotPatchFields(item, patch) {
  if (!item) return {};
  return Object.fromEntries(Object.keys(patch).map((key) => [key, item[key]]));
}

export function snapshotPatchesById(items, ids, patch) {
  const wanted = new Set(ids);
  return items
    .filter((item) => wanted.has(item.id))
    .map((item) => ({ id: item.id, patch: snapshotPatchFields(item, patch) }));
}
