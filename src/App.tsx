import { Link, Navigate, Route, Routes } from "react-router-dom";
import { HistoryPage } from "@/pages/history/page";
import { HomePage } from "@/pages/home-page";
import { PlusIcon, SquareCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStartSessionNavigation } from "@/hooks/useStartSessionNavigation";

function App() {
  const { startSession, isCreating } = useStartSessionNavigation();

  return (
    <div className="h-min grid grid-cols-1 gap-y-4">
      <header className="flex justify-between p-6">
        <Link to="/" className="flex gap-x-2 font-bold items-center">
          <SquareCheckIcon className="size-6" />
          TODO Sessions
        </Link>
        <nav className="flex gap-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isCreating}
            onClick={() => {
              void startSession();
            }}
          >
            <PlusIcon />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            render={<Link to="/history">History</Link>}
          />
        </nav>
      </header>

      <main className="page-wrap text-gray-500">
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
