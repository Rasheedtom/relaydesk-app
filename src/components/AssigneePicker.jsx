import React from "react";
const PEOPLE = ["Maya Chen", "Tariq Bell", "Rosa Diaz", "Noah Kim"];
export function AssigneePicker({ value, onChange, disabled }) {
  return <label className="stack-field"><span>Assignee</span><select value={value ?? ""} disabled={disabled} onChange={(e) => onChange(e.target.value || null)}><option value="">Unassigned</option>{PEOPLE.map((person) => <option key={person}>{person}</option>)}</select></label>;
}
