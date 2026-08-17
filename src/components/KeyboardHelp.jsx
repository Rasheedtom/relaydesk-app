import React from "react";
export function KeyboardHelp({ open, onClose }) {
  if (!open) return null;
  return <div className="help-popover" role="dialog" aria-modal="false" aria-labelledby="shortcut-title"><div className="help-head"><strong id="shortcut-title">Keyboard shortcuts</strong><button aria-label="Close keyboard shortcuts" onClick={onClose}>×</button></div><dl><div><dt><kbd>/</kbd></dt><dd>Focus search</dd></div><div><dt><kbd>Esc</kbd></dt><dd>Close details</dd></div><div><dt><kbd>?</kbd></dt><dd>Toggle shortcuts</dd></div></dl></div>;
}
