import { Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext.jsx";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return children;
}