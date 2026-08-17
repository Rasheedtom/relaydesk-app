import React from "react";
export function ToastRegion({ message }) {
  return <div className="toast-region" aria-live="polite" aria-atomic="true">{message && <div className="toast">{message}</div>}</div>;
}
