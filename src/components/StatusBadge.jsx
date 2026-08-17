import React from "react";
import { formatStatus } from "../domain/formatters.js";
export function StatusBadge({ status }) {
  return <span className={`badge status status-${status}`}>{formatStatus(status)}</span>;
}
