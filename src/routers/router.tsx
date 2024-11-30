import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import FallBack from "../components/FallBack";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NonSelectedRoleRoute from "./NonSelectedRoleRoute";
import SetRole from "../pages/SetRole";
import SelectedRoleRoute from "./SelectedRoleRoute";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import CompletedProfileStep from "./CompletedProfileStep";
import Jobs from "../pages/Jobs";
import CreateNewJob from "../pages/CreateNewJob";
import AccessDenied from "../pages/AccessDenied";
import RecuiterRoute from "./RecruiterRoute";
import CandidateRoute from "./CandidateRoute";
import JobDetails from "../pages/JobDetails";
import RecommendedJobs from "../pages/RecommendedJobs";
import PostedJobs from "../pages/PostedJobs";
const HomePage = lazy(() => import("../pages/Home"));

const RouterComponent = () => {
  return (
    <Suspense fallback={<FallBack />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<SelectedRoleRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route element={<CompletedProfileStep />}>
              <Route path="/" element={<HomePage />} />
              <Route element={<CandidateRoute />}>
                <Route path="/all-jobs" element={<Jobs />} />
                <Route path="/recommended-jobs" element={<RecommendedJobs />} />
                <Route path="/job-details/:jobId" element={<JobDetails />} />
              </Route>
              <Route element={<RecuiterRoute />}>
                <Route path="/create-job" element={<CreateNewJob />} />
                <Route path="/posted-jobs" element={<PostedJobs />} />
              </Route>
            </Route>
          </Route>
          <Route element={<NonSelectedRoleRoute />}>
            <Route path="/set-role" element={<SetRole />} />
          </Route>
          <Route path="/access-denied" element={<AccessDenied />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;
