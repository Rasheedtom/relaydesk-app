import React from "react";
import { formatPriority } from "../domain/formatters.js";
export function PriorityBadge({ priority }) {
  return <span className={`badge priority priority-${priority}`}>{formatPriority(priority)}</span>;
}
