import React from "react";

export function NoteComposer({ value, onChange, onSubmit, disabled }) {
  function submit(event) {
    event.preventDefault();
    const body = value.trim();
    if (!body) return;
    onSubmit(body);
  }

  return <form className="note-composer" onSubmit={submit}>
    <label><span>Internal note</span><textarea rows="3" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="Add context for the next teammate…" /></label>
    <div><span>{value.trim().length}/280</span><button className="button primary" disabled={disabled || !value.trim() || value.trim().length > 280}>Add note</button></div>
  </form>;
}
