import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access unauthorized route
    const dashboards: Record<UserRole, string> = {
      admin: "/admin",
      owner: "/owner",
      staff: "/staff",
      user: "/home",
    };
    return <Navigate to={dashboards[user.role]} replace />;
  }

  return <>{children}</>;
};
