import { useEffect } from "react";
import NotificationsPageInner from "@/components/cente/notifications-page";

export default function NotificationsPage() {
  useEffect(() => { document.title = "Notifications — CENTE"; }, []);
  return <NotificationsPageInner />;
}
