import React from "react";
import { PriorityBadge } from "./PriorityBadge.jsx";
import { StatusBadge } from "./StatusBadge.jsx";
import { formatAge, formatDue } from "../domain/formatters.js";

export function QueueRow({ item, selected, onToggle, onOpen }) {
  return <tr className={item.unread ? "queue-row unread" : "queue-row"}>
    <td className="select-cell"><input type="checkbox" aria-label={`Select ${item.subject}`} checked={selected} onChange={() => onToggle(item.id)} /></td>
    <td><button className="subject-button" onClick={() => onOpen(item.id)}><span className="subject-line">{item.unread && <span className="unread-dot" aria-label="Unread">●</span>}{item.subject}</span><span className="requester-line">{item.requester.name} · {item.team}</span></button></td>
    <td><PriorityBadge priority={item.priority} /></td>
    <td><StatusBadge status={item.status} /></td>
    <td><span className={item.assignee ? "assignee" : "assignee empty"}>{item.assignee ?? "Unassigned"}</span></td>
    <td><span className="due-text">{formatDue(item.dueAt)}</span></td>
    <td><span className="age-text">{formatAge(item.updatedAt)}</span></td>
  </tr>;
}
