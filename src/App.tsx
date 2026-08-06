import { Link, Navigate, Route, Routes } from "react-router-dom";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { SessionPage } from "./pages/session/page";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          TODO Sessions
        </Link>
        <nav className="topbar-nav">
          <Link to="/history" className="nav-link">
            History
          </Link>
        </nav>
      </header>

      <main className="page-wrap text-gray-500">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions/:sessionId" element={<SessionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
