import React from "react";
import { ASSIGNEES, PRIORITIES, TEAMS } from "../domain/constants.js";

export function FilterBar({ filters, onChange }) {
  return <fieldset className="filter-bar"><legend className="sr-only">Queue filters</legend>
    <label><span>Team</span><select value={filters.team} onChange={(e) => onChange("team", e.target.value)}><option value="all">All teams</option>{TEAMS.map((team) => <option key={team}>{team}</option>)}</select></label>
    <label><span>Priority</span><select value={filters.priority} onChange={(e) => onChange("priority", e.target.value)}><option value="all">All priorities</option>{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority[0].toUpperCase()+priority.slice(1)}</option>)}</select></label>
    <label><span>Assignee</span><select value={filters.assignee} onChange={(e) => onChange("assignee", e.target.value)}><option value="all">All assignees</option><option value="unassigned">Unassigned</option>{ASSIGNEES.map((assignee) => <option key={assignee}>{assignee}</option>)}</select></label>
    <label className="check-filter"><input type="checkbox" checked={filters.unreadOnly} onChange={(e) => onChange("unreadOnly", e.target.checked)} /><span>Unread only</span></label>
    <label className="check-filter"><input type="checkbox" checked={filters.overdueOnly} onChange={(e) => onChange("overdueOnly", e.target.checked)} /><span>Overdue only</span></label>
  </fieldset>;
}
