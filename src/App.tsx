import { Link, Navigate, Route, Routes } from "react-router-dom";
import { HistoryPage } from "./pages/history/page";
import { HomePage } from "./pages/HomePage";
import { SessionPage } from "./pages/session/page";
import { CiSquareCheck } from "react-icons/ci";

function App() {
  return (
    <div className="h-min grid">
      <header className="topbar">
        <Link to="/" className="flex gap-x-2 font-bold items-center">
          <CiSquareCheck className="size-6" />
          TODO Sessions
        </Link>
        <nav className="b">
          <Link
            to="/history"
            className="text-input px-3 py-2 rounded-full border border-line"
          >
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
