import React from "react";
export function Header({ unreadCount, onToggleHelp }) {
  return <header className="app-header">
    <div className="brand"><span className="brand-mark" aria-hidden="true">R</span><div><strong>RelayDesk</strong><span>Operations queue</span></div></div>
    <div className="header-actions">
      <span className="unread-summary">{unreadCount} unread</span>
      <button className="button ghost" onClick={onToggleHelp} aria-label="Open keyboard shortcuts">Shortcuts</button>
      <div className="avatar" aria-label="Signed in as Alex Morgan">AM</div>
    </div>
  </header>;
}
