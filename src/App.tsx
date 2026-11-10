import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { HomePage } from "./pages/HomePage";
import { ChampionshipPage } from "./pages/ChampionshipPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/campeonatos/:slug" element={<ChampionshipPage />} />
        <Route path="/times/:id" element={<PlaceholderPage />} />
        <Route path="/jogos/:id" element={<PlaceholderPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Routes>
    </AppShell>
  );
}
