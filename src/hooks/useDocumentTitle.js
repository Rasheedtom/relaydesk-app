import { useEffect } from "react";

export function useDocumentTitle(unreadCount) {
  useEffect(() => {
    const previous = document.title;
    document.title = unreadCount ? `(${unreadCount}) RelayDesk` : "RelayDesk";
    return () => { document.title = previous; };
  }, [unreadCount]);
}
