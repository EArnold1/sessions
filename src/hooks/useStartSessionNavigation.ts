import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateSession } from "@/hooks/useCreateSession";

type StartSessionOptions = {
  replace?: boolean;
};

export function useStartSessionNavigation() {
  const navigate = useNavigate();
  const { createSessionId, isCreating, error } = useCreateSession();

  const startSession = useCallback(
    async ({ replace = true }: StartSessionOptions = {}) => {
      const sessionId = await createSessionId();
      navigate(
        {
          pathname: "/",
          search: `?sessionId=${sessionId}`,
        },
        { replace },
      );

      return sessionId;
    },
    [createSessionId, navigate],
  );

  return {
    startSession,
    isCreating,
    error,
  };
}
