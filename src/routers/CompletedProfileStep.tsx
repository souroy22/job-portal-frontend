import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const CompletedProfileStep = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  if (!user?.finishedProfile) {
    return <Navigate to="/profile" />;
  }

  return <Outlet />;
};

export default CompletedProfileStep;
