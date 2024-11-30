import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import { useMemo } from "react";

const NonSelectedRoleRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.userReducer);

  const prevUrl = useMemo(() => {
    let url =
      new URLSearchParams(location.search).get("prevUrl") || location.pathname;
    return url.includes("/signin") ||
      url.includes("/signup") ||
      url.includes("/set-role")
      ? "/"
      : url;
  }, [location]);

  if (user && user.role) {
    return <Navigate to={prevUrl} state={{ prevUrl: location.pathname }} />;
  }

  return <Outlet />;
};

export default NonSelectedRoleRoute;
