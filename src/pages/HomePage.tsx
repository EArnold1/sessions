import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createSession } from "../data/store";

export function HomePage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartSession = async () => {
    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const session = await createSession();
      navigate(`/sessions/${session.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="panel hero-panel">
      <p className="eyebrow">Offline-first focus</p>
      <h1 className="hero-title">
        Run focused TODO sessions that stay on your device.
      </h1>
      <p className="hero-copy">
        Start a session, capture tasks quickly, and revisit your history any
        time.
      </p>

      <div className="hero-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStartSession}
        >
          {isCreating ? "Starting..." : "Start Session"}
        </button>
        <Link className="btn btn-ghost" to="/history">
          View History
        </Link>
      </div>
    </section>
  );
}
