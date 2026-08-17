export function getReturnFocusTarget(trigger, fallback) {
  return trigger?.isConnected ? trigger : fallback ?? null;
}
