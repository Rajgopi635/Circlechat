import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION OBJECT:", session);

      setSession(session);
      setLoading(false);
    };

    getSession();
  }, []);

  console.log("CURRENT SESSION STATE:", session);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    console.log("❌ No session found. Redirecting to Login...");
    return <Navigate to="/" replace />;
  }

  console.log("✅ Session found. Opening protected page...");

  return children;
}

export default ProtectedRoute;