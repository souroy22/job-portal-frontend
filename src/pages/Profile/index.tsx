import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useMemo } from "react";
import { Box } from "@mui/material";
import classes from "./style.module.css";
import JobSeekerProfileForm from "../../components/JobSeekerProfileForm";
import CompanyProfileForm from "../../components/CompanyProfileForm";
import CreateJobForm from "../../components/CreateJobForm";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const memoizedUser = useMemo(() => user, [user]);

  return (
    <Box className={classes.profileContainer}>
      {memoizedUser?.role === "job_seeker" ? (
        <Box>
          <JobSeekerProfileForm />
        </Box>
      ) : (
        <Box>
          <CompanyProfileForm />
          {/* <CreateJobForm /> */}
        </Box>
      )}
    </Box>
  );
};

export default Profile;
