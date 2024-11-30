import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { useMemo } from "react";

const CandidateRoute = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const memoizedUser = useMemo(() => user, [user]);

  if (memoizedUser?.role === "job_seeker") {
    return <Outlet />;
  }

  return <Navigate to="/access-denied" />;
};

export default CandidateRoute;
