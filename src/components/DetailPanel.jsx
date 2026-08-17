import React from "react";
import { AssigneePicker } from "./AssigneePicker.jsx";
import { ActivityTimeline } from "./ActivityTimeline.jsx";
import { NoteComposer } from "./NoteComposer.jsx";
import { PriorityBadge } from "./PriorityBadge.jsx";
import { StatusBadge } from "./StatusBadge.jsx";

export function DetailPanel({ item, saving, onClose, onAssignee, onStatus, onNote }) {
  if (!item) return null;
  return <aside className="detail-panel" aria-label={`Request details: ${item.subject}`}>
    <div className="detail-header"><div><span className="ticket-id">{item.id}</span><h2>{item.subject}</h2></div><button className="icon-button" aria-label="Close details" onClick={onClose}>×</button></div>
    <div className="detail-badges"><PriorityBadge priority={item.priority} /><StatusBadge status={item.status} />{saving && <span role="status" className="saving-label">Saving…</span>}</div>
    <p className="detail-summary">{item.summary}</p>
    <dl className="requester-card"><div><dt>Requester</dt><dd>{item.requester.name}</dd></div><div><dt>Email</dt><dd>{item.requester.email}</dd></div><div><dt>Team</dt><dd>{item.team}</dd></div></dl>
    <div className="detail-fields"><AssigneePicker value={item.assignee} disabled={saving} onChange={onAssignee} /><label className="stack-field"><span>Status</span><select value={item.status} disabled={saving} onChange={(e) => onStatus(e.target.value)}><option value="new">New</option><option value="in_progress">In progress</option><option value="waiting">Waiting</option><option value="resolved">Resolved</option></select></label></div>
    <section className="activity-section"><h3>Activity</h3><ActivityTimeline activities={item.activities} /></section>
    <NoteComposer disabled={saving} onSubmit={onNote} />
  </aside>;
}
