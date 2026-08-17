import { matchesQuery } from "../domain/filterQueue.js";

const SEARCH_DELAYS = { export: 520, invoice: 420, reset: 360, account: 280 };

function abortError() {
  const error = new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(abortError());
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function searchWorkItems(items, query, { signal } = {}) {
  const key = query.trim().toLowerCase();
  const delay = SEARCH_DELAYS[key] ?? Math.max(90, 260 - key.length * 18);
  await wait(delay, signal);
  return items.filter((item) => matchesQuery(item, query)).map((item) => item.id);
}

export async function persistItemPatch(id, patch) {
  await wait(110);
  return { id, patch, savedAt: new Date().toISOString() };
}

export async function persistReadReceipt(id) {
  return persistItemPatch(id, { unread: false });
}

export async function persistInternalNote(id, body) {
  await wait(120);
  return { id, body, savedAt: new Date().toISOString() };
}

export async function persistBulkPatch(ids, patch) {
  await wait(150);
  return { ids: [...ids], patch, savedAt: new Date().toISOString() };
}
