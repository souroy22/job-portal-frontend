import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useMemo } from "react";
import { Box } from "@mui/material";
import classes from "./style.module.css";
import JobSeekerProfileForm from "../../components/JobSeekerProfileForm";
import CompanyProfileForm from "../../components/CompanyProfileForm";
import RecruiterProfile from "../../components/RecruiterProfile";
import CandidateProfile from "../../components/CandidateProfile";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const memoizedUser = useMemo(() => user, [user]);

  return (
    <Box className={classes.profileContainer}>
      {memoizedUser?.finishedProfile ? (
        memoizedUser?.role === "job_seeker" ? (
          <Box>
            <CandidateProfile />
          </Box>
        ) : (
          <Box>
            <RecruiterProfile />
          </Box>
        )
      ) : memoizedUser?.role === "job_seeker" ? (
        <Box>
          <JobSeekerProfileForm />
        </Box>
      ) : (
        <Box>
          <CompanyProfileForm />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
