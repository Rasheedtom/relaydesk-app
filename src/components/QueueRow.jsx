import React from "react";
import { PriorityBadge } from "./PriorityBadge.jsx";
import { StatusBadge } from "./StatusBadge.jsx";
import { formatAge, formatDateTime, formatDue } from "../domain/formatters.js";

export function QueueRow({ item, selected, onToggle, onOpen }) {
  return <tr className={item.unread ? "queue-row unread" : "queue-row"}>
    <td className="select-cell"><input type="checkbox" aria-label={`Select ${item.subject}`} checked={selected} onChange={() => onToggle(item.id)} /></td>
    <td><button className="subject-button" onClick={(event) => onOpen(item.id, event.currentTarget)}><span className="subject-line">{item.unread && <span className="unread-dot" aria-label="Unread">●</span>}{item.subject}</span><span className="requester-line">{item.requester.name} · {item.team}</span></button></td>
    <td><PriorityBadge priority={item.priority} /></td>
    <td><StatusBadge status={item.status} /></td>
    <td><span className={item.assignee ? "assignee" : "assignee empty"}>{item.assignee ?? "Unassigned"}</span></td>
    <td><time className="due-text" dateTime={item.dueAt} title={formatDateTime(item.dueAt)}>{formatDue(item.dueAt)}</time></td>
    <td><time className="age-text" dateTime={item.updatedAt} title={formatDateTime(item.updatedAt)}>{formatAge(item.updatedAt)}</time></td>
  </tr>;
}
