import React from "react";
export function ActivityTimeline({ activities }) {
  return <ol className="timeline">{activities.map((activity) => <li key={activity.id}><div className={`timeline-icon ${activity.kind}`} aria-hidden="true">{activity.kind === "system" ? "↻" : "✦"}</div><div><div className="timeline-meta"><strong>{activity.author}</strong><time dateTime={activity.at}>{new Date(activity.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time></div><p>{activity.body}</p></div></li>)}</ol>;
}
