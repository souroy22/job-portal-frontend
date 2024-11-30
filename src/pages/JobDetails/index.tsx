import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { JOB_TYPE } from "../../store/job/jobReducer";
import { getJobDetails } from "../../api/job.api";
import { useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BlindsIcon from "@mui/icons-material/Blinds";

interface JOB_DETAILS extends JOB_TYPE {
  applicantCount: number;
  status: "open" | "closed";
}

const JobDetails = () => {
  const [jobData, setJobData] = useState<JOB_DETAILS | null>(null);

  const { jobId } = useParams();

  const onLoad = async () => {
    if (jobId) {
      const jobDetails = await getJobDetails(jobId);
      setJobData(jobDetails);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ color: "#FFF" }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" fontWeight={700}>
            {jobData?.title}
          </Typography>
          <Box>
            <img src={jobData?.logo} width="100px" height="50px" />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <LocationOnIcon fontSize="small" />
            {jobData?.location}
          </Box>
          <Box>
            <BusinessCenterIcon fontSize="small" />
            {jobData?.applicantCount}
          </Box>
          <Box>
            <BlindsIcon fontSize="small" />
            {jobData?.status === "open" ? "Open" : "Closed"}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            Job Type:{" "}
          </Typography>
          <Typography variant="h6">{jobData?.jobType}</Typography>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Key Skills
          </Typography>
          <Box sx={{ display: "flex", gap: "20px" }}>
            {jobData?.requirements.map((skill) => (
              <Chip
                label={skill}
                sx={{
                  bgcolor: "#0a267c",
                  color: "#FFF",
                  fontWeight: 700,
                  textShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
                }}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Job Description
          </Typography>
          <Typography variant="h6" component="p" fontWeight={400}>
            {jobData?.description}
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default JobDetails;
