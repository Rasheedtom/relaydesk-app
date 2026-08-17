import React from "react";
import { ASSIGNEES } from "../domain/constants.js";
export function AssigneePicker({ value, onChange, disabled }) {
  return <label className="stack-field"><span>Assignee</span><select value={value ?? ""} disabled={disabled} onChange={(e) => onChange(e.target.value || null)}><option value="">Unassigned</option>{ASSIGNEES.map((person) => <option key={person}>{person}</option>)}</select></label>;
}
