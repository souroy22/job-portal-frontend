import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import FallBack from "../components/FallBack";
import NonSelectedRoleRoute from "./NonSelectedRoleRoute";
import SelectedRoleRoute from "./SelectedRoleRoute";
import CompletedProfileStep from "./CompletedProfileStep";
import RecuiterRoute from "./RecruiterRoute";
import CandidateRoute from "./CandidateRoute";

// Lazy load pages
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Profile = lazy(() => import("../pages/Profile"));
const SetRole = lazy(() => import("../pages/SetRole"));
const Jobs = lazy(() => import("../pages/Jobs"));
const CreateNewJob = lazy(() => import("../pages/CreateNewJob"));
const AccessDenied = lazy(() => import("../pages/AccessDenied"));
const JobDetails = lazy(() => import("../pages/JobDetails"));
const RecommendedJobs = lazy(() => import("../pages/RecommendedJobs"));
const PostedJobs = lazy(() => import("../pages/PostedJobs"));
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
              <Route path="/job-details/:jobId" element={<JobDetails />} />
              <Route element={<CandidateRoute />}>
                <Route path="/all-jobs" element={<Jobs />} />
                <Route path="/recommended-jobs" element={<RecommendedJobs />} />
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
