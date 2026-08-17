import { PRIORITY_LABELS, STATUS_LABELS } from "./constants.js";

export function formatStatus(status) {
  return STATUS_LABELS[status] ?? status;
}

export function formatPriority(priority) {
  return PRIORITY_LABELS[priority] ?? priority;
}

export function formatAge(iso, now = Date.now()) {
  const delta = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(delta / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function formatDue(iso, now = Date.now()) {
  const delta = new Date(iso).getTime() - now;
  const absMinutes = Math.max(1, Math.floor(Math.abs(delta) / 60000));
  const hours = Math.floor(absMinutes / 60);
  const amount = hours ? `${hours}h` : `${absMinutes}m`;
  return delta < 0 ? `${amount} overdue` : `due in ${amount}`;
}
