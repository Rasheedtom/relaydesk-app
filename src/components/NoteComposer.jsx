import React from "react";
import { useState } from "react";
export function NoteComposer({ onSubmit, disabled }) {
  const [note, setNote] = useState("");
  function submit(event) { event.preventDefault(); const body = note.trim(); if (!body) return; onSubmit(body); setNote(""); }
  return <form className="note-composer" onSubmit={submit}><label><span>Internal note</span><textarea rows="3" value={note} disabled={disabled} onChange={(e) => setNote(e.target.value)} placeholder="Add context for the next teammate…" /></label><div><span>{note.trim().length}/280</span><button className="button primary" disabled={disabled || !note.trim() || note.trim().length > 280}>Add note</button></div></form>;
}
