import { Box, Container, Typography } from "@mui/material";
import JobCard from "../../components/JobCard";
import classes from "./style.module.css";
import { useEffect, useState } from "react";
import { JOB_TYPE } from "../../store/job/jobReducer";
import handleAsync from "../../utils/handleAsync";
import { getPostedJobs } from "../../api/job.api";
import DataHandler from "../../components/DataHandler";

const PostedJobs = () => {
  const [jobs, setJobs] = useState<JOB_TYPE[] | null>(null);

  const onLoad = handleAsync(async () => {
    const data = await getPostedJobs();
    setJobs(data.data);
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
        Posted Jobs
      </Typography>
      <Box className={classes.jobListContainer}>
        <DataHandler
          data={jobs}
          renderData={(jobs) =>
            jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                location={job.location}
                description={job.description}
                logo={job.logo}
                jobId={job.id}
                applied={job.applied}
              />
            ))
          }
        />
      </Box>
    </Container>
  );
};

export default PostedJobs;
