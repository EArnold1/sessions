import { useCallback, useState } from "react";

import { createSession } from "@/data/store";

let createSessionInFlight: Promise<string> | null = null;

async function getOrCreateSessionId(): Promise<string> {
  if (!createSessionInFlight) {
    createSessionInFlight = createSession()
      .then((session) => session.id)
      .finally(() => {
        createSessionInFlight = null;
      });
  }

  return createSessionInFlight;
}

export function useCreateSession() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSessionId = useCallback(async (): Promise<string> => {
    setError(null);
    setIsCreating(true);

    try {
      return await getOrCreateSessionId();
    } catch (unknownError) {
      const nextError =
        unknownError instanceof Error
          ? unknownError
          : new Error("Failed to create session");
      setError(nextError);
      throw nextError;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createSessionId,
    isCreating,
    error,
  };
}
