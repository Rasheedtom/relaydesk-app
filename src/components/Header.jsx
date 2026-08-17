import React from "react";
export function Header({ unreadCount, helpOpen, onToggleHelp }) {
  return <header className="app-header">
    <div className="brand"><span className="brand-mark" aria-hidden="true">R</span><div><strong>RelayDesk</strong><span>Operations queue</span></div></div>
    <div className="header-actions">
      <span className="unread-summary">{unreadCount} unread</span>
      <button className="button ghost" aria-expanded={helpOpen} aria-controls="keyboard-help" onClick={(event) => onToggleHelp(event.currentTarget)}>Shortcuts</button>
      <div className="avatar" aria-label="Signed in as Alex Morgan">AM</div>
    </div>
  </header>;
}
