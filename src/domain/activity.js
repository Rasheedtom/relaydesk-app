import { formatStatus } from "./formatters.js";

export function describeItemPatch(patch) {
  const changes = [];
  if (Object.prototype.hasOwnProperty.call(patch, "status")) changes.push(`Changed status to ${formatStatus(patch.status)}.`);
  if (Object.prototype.hasOwnProperty.call(patch, "assignee")) changes.push(patch.assignee ? `Assigned request to ${patch.assignee}.` : "Removed the assignee.");
  return changes.join(" ");
}

export function createPatchActivity(patch, options = {}) {
  const at = options.at ?? new Date().toISOString();
  return {
    id: options.id ?? `change-${Date.now()}`,
    kind: "system",
    author: options.actor ?? "Alex Morgan",
    body: describeItemPatch(patch),
    at,
  };
}
