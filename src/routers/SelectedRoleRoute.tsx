import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const SelectedRoleRoute = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  if (!user?.role) {
    return <Navigate to="/set-role" />;
  }

  return <Outlet />;
};

export default SelectedRoleRoute;
