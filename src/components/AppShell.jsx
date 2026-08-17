import React from "react";
export function AppShell({ header, sidebar, children, detail }) {
  return <div className="app-shell">{header}<div className="workspace">{sidebar}<main className="main-content">{children}</main>{detail}</div></div>;
}
