import { useEffect, useRef } from "react";

export function useKeyboardShortcut(key, callback, options = {}) {
  const { meta = false, enabled = true } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;
    function onKeyDown(event) {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName));
      if (typing && !meta) return;
      const metaMatches = meta ? event.metaKey || event.ctrlKey : !event.metaKey && !event.ctrlKey;
      if (event.key.toLowerCase() === key.toLowerCase() && metaMatches) {
        event.preventDefault();
        callbackRef.current(event);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, key, meta]);
}
