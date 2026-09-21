import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/cente/app-shell";
import { CenteProvider } from "@/state/cente-context";
import HomePage from "@/pages/Home";
import WalletPage from "@/pages/Wallet";
import TransactionsPage from "@/pages/Transactions";
import WealthPage from "@/pages/Wealth";
import ProfilePage from "@/pages/Profile";
import NotificationsPage from "@/pages/Notifications";
import { NotFound } from "@/components/cente/not-found";

function Layout() {
  return (
    <CenteProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/wealth" element={<WealthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </CenteProvider>
  );
}

export default function App() { return <Layout />; }
