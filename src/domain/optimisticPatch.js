export function snapshotPatchFields(item, patch) {
  if (!item) return {};
  return Object.fromEntries(Object.keys(patch).map((key) => [key, item[key]]));
}
