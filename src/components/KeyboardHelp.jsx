import React from "react";
import { useEffect, useRef } from "react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut.js";

export function KeyboardHelp({ open, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);
  useKeyboardShortcut("Escape", onClose, { enabled: open });
  if (!open) return null;
  return <div id="keyboard-help" className="help-popover" role="dialog" aria-modal="false" aria-labelledby="shortcut-title"><div className="help-head"><strong id="shortcut-title">Keyboard shortcuts</strong><button ref={closeRef} aria-label="Close keyboard shortcuts" onClick={onClose}>×</button></div><dl><div><dt><kbd>/</kbd></dt><dd>Focus search</dd></div><div><dt><kbd>Esc</kbd></dt><dd>Close the active panel</dd></div><div><dt><kbd>?</kbd></dt><dd>Toggle shortcuts</dd></div></dl></div>;
}
