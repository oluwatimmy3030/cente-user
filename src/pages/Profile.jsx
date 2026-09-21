import { useEffect } from "react";
import ProfilePageInner from "@/components/cente/profile-page";

export default function ProfilePage() {
  useEffect(() => { document.title = "Profile & Security — CENTE"; }, []);
  return <ProfilePageInner />;
}
