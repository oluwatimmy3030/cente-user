import { useEffect } from "react";
import { HomePage as HomePageInner } from "@/components/cente/home-page";

export default function HomePage() {
  useEffect(() => { document.title = "Home — CENTE"; }, []);
  return <HomePageInner />;
}
