import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    } else if (user && user.role !== "Admin" && user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  }
  return null;
};

export default ProtectedAdminRoute;
