import { Link, Navigate, Route, Routes } from "react-router-dom";
import { HistoryPage } from "@/pages/history/page";
import { HomePage } from "@/pages/home-page";
import { SquareCheckIcon } from "lucide-react";
import { useStartSessionNavigation } from "@/hooks/useStartSessionNavigation";
import { IconButton } from "./components/icon-button";
import { LinkButton } from "./components/link-button";
import { useTheme } from "@/components/theme-provider";

function App() {
  const { startSession, isCreating } = useStartSessionNavigation();
  const { theme, toggleTheme } = useTheme();
  const themeIcon =
    theme === "light" ? "Sun" : theme === "dark" ? "Moon" : "Monitor";

  return (
    <div className="h-min grid grid-cols-1 gap-y-4">
      <header className="flex justify-between p-6">
        <Link to="/" className="flex gap-x-2 font-bold items-center">
          <SquareCheckIcon className="size-6" />
          TODO Sessions
        </Link>
        <nav className="flex gap-x-2">
          <IconButton
            variant="outline"
            size="icon"
            icon={themeIcon}
            aria-label={`Theme mode: ${theme}. Click to switch mode`}
            title={`Theme mode: ${theme}`}
            onClick={toggleTheme}
          />

          <IconButton
            variant="outline"
            size="icon"
            disabled={isCreating}
            onClick={() => {
              void startSession();
            }}
            icon="Plus"
          />

          <LinkButton
            to="/history"
            btnProps={{
              variant: "ghost",
              className: "rounded-full",
              children: "History",
            }}
          />
        </nav>
      </header>

      <main className="w-full max-w-250 mx-auto container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
