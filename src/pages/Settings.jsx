import { useEffect } from "react";
import ProfilePageInner from "@/components/cente/profile-page";

export default function SettingsPage() {
  useEffect(() => { document.title = "Settings — CENTE"; }, []);
  return <ProfilePageInner />;
}