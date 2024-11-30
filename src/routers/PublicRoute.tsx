import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import AuthLayout from "../layouts/AuthLayout";

const PublicRoute = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.userReducer);

  if (user) {
    if (!user.role) {
      return <Navigate to="/set-role" />;
    }
    let prevUrl =
      new URLSearchParams(location.search).get("prevUrl") || location.pathname;
    if (prevUrl.includes("/signin") || prevUrl.includes("/signup")) {
      prevUrl = "/";
    }
    return <Navigate to={prevUrl} state={{ prevUrl: location.pathname }} />;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export default PublicRoute;
