import { Box, Container, Typography } from "@mui/material";
import JobCard from "../../components/JobCard";
import classes from "./style.module.css";
import { useEffect, useState } from "react";
import { JOB_TYPE } from "../../store/job/jobReducer";
import handleAsync from "../../utils/handleAsync";
import { getAppliedJobs } from "../../api/job.api";
import { setGlobalLoading } from "../../store/global/globalReducer";
import { useDispatch } from "react-redux";

const AppliedJobs = () => {
  const [jobs, setJobs] = useState<JOB_TYPE[] | null>(null);

  const dispatch = useDispatch();

  const onLoad = handleAsync(async () => {
    dispatch(setGlobalLoading(true));
    const data = await getAppliedJobs();
    setJobs(data);
    dispatch(setGlobalLoading(false));
  });

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{ overflowY: "hidden", height: "calc(100svh - 120px)" }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        color="#FFF"
        textAlign="center"
        marginBottom="20px"
        className={classes.textGlow}
      >
        Recommended Jobs
      </Typography>
      <Box className={classes.jobListContainer}>
        {!jobs?.length ? (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" color="gray">
              No Data found
            </Typography>
          </Box>
        ) : (
          jobs?.map((job) => (
            <JobCard
              title={job.title}
              location={job.location}
              description={job.description}
              logo={job.logo}
              jobId={job.id}
              applied={job.applied}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default AppliedJobs;
