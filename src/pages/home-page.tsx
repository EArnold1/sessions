import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { SessionView } from "@/components/session/session-view";
import { useStartSessionNavigation } from "@/hooks/useStartSessionNavigation";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const { startSession } = useStartSessionNavigation();

  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    if (sessionId) {
      return;
    }

    let cancelled = false;

    async function ensureSession() {
      try {
        await startSession();
      } catch {
        // Navigation hook manages loading lifecycle; keep page in loading state on failure.
      }
    }

    if (!cancelled) {
      void ensureSession();
    }

    return () => {
      cancelled = true;
    };
  }, [sessionId, startSession]);

  if (!sessionId) {
    return <div>Loading...</div>;
  }

  return <SessionView sessionId={sessionId} />;
}
