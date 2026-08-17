import { matchesQuery } from "../domain/filterQueue.js";

const SEARCH_DELAYS = { export: 520, invoice: 420, reset: 360, account: 280 };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchWorkItems(items, query) {
  const key = query.trim().toLowerCase();
  const delay = SEARCH_DELAYS[key] ?? Math.max(90, 260 - key.length * 18);
  await wait(delay);
  return items.filter((item) => matchesQuery(item, query)).map((item) => item.id);
}

export async function persistItemPatch(id, patch) {
  await wait(110);
  return { id, patch, savedAt: new Date().toISOString() };
}

export async function persistBulkPatch(ids, patch) {
  await wait(150);
  return { ids: [...ids], patch, savedAt: new Date().toISOString() };
}
