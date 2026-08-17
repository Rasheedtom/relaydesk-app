import React from "react";
import { PRIORITIES, TEAMS } from "../domain/constants.js";

export function FilterBar({ filters, onChange }) {
  return <div className="filter-bar" aria-label="Queue filters">
    <label><span>Team</span><select value={filters.team} onChange={(e) => onChange("team", e.target.value)}><option value="all">All teams</option>{TEAMS.map((team) => <option key={team}>{team}</option>)}</select></label>
    <label><span>Priority</span><select value={filters.priority} onChange={(e) => onChange("priority", e.target.value)}><option value="all">All priorities</option>{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority[0].toUpperCase()+priority.slice(1)}</option>)}</select></label>
    <label className="check-filter"><input type="checkbox" checked={filters.unreadOnly} onChange={(e) => onChange("unreadOnly", e.target.checked)} /><span>Unread only</span></label>
  </div>;
}
