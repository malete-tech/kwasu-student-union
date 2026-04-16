import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      console.log("ProtectedRoute: No session found. Redirecting to /login.");
      navigate("/login", { replace: true });
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-brand-50 text-brand-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-brand-700 animate-pulse">
            Checking Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect handled by useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
