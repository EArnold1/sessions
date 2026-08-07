import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HistoryPage } from "@/pages/history/page";
import { HomePage } from "@/pages/home-page";
import {
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SquareCheckIcon,
  SunIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useStartSessionNavigation } from "@/hooks/useStartSessionNavigation";
import { IconButton } from "./components/icon-button";
import { LinkButton } from "./components/link-button";
import { useTheme } from "@/components/theme-provider";

function App() {
  const { startSession, isCreating } = useStartSessionNavigation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const ThemeIcon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : MonitorIcon;
  const pageTitle =
    location.pathname === "/history" ? "Session History" : "TODO Sessions";

  useEffect(() => {
    document.title = pageTitle;
    mainRef.current?.focus();
  }, [location.pathname, location.search, pageTitle]);

  return (
    <div className="grid h-min grid-cols-1 gap-y-4">
      <a
        className="focus:bg-background sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:p-3"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className="flex flex-wrap justify-between gap-3 p-4">
        <Link to="/" className="flex items-center gap-x-2 font-bold">
          <SquareCheckIcon className="size-6" />
          TODO Sessions
        </Link>
        <nav className="flex flex-wrap gap-2">
          <IconButton
            variant="outline"
            size="icon"
            icon={ThemeIcon}
            aria-label={`Theme mode: ${theme}. Click to switch mode`}
            title={`Theme mode: ${theme}`}
            tooltip="Change theme"
            onClick={toggleTheme}
          />

          <IconButton
            variant="outline"
            size="icon"
            disabled={isCreating}
            onClick={() => {
              void startSession();
            }}
            icon={PlusIcon}
            aria-label="Start new session"
            tooltip="Start new session"
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

      <p className="sr-only" aria-live="polite">
        {pageTitle}
      </p>
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="container mx-auto w-full max-w-250"
      >
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
