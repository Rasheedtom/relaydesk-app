import React from "react";

export const MAX_NOTE_LENGTH = 280;

export function NoteComposer({ value, onChange, onSubmit, disabled, pending = false }) {
  function submit(event) {
    event.preventDefault();
    const body = value.trim();
    if (!body) return;
    onSubmit(body);
  }

  const countId = "internal-note-count";
  return <form className="note-composer" onSubmit={submit}>
    <label><span>Internal note</span><textarea rows="3" value={value} maxLength={MAX_NOTE_LENGTH} aria-describedby={countId} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="Add context for the next teammate…" /></label>
    <div><span id={countId} aria-live="polite">{pending ? "Saving note…" : `${value.length}/${MAX_NOTE_LENGTH}`}</span><button className="button primary" disabled={disabled || !value.trim()}>{pending ? "Saving…" : "Add note"}</button></div>
  </form>;
}
