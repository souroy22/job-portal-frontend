import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { JOB_TYPE } from "../../store/job/jobReducer";
import { getJobDetails } from "../../api/job.api";
import { useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BlindsIcon from "@mui/icons-material/Blinds";
import handleAsync from "../../utils/handleAsync";
import { applyJob, changeStatus } from "../../api/application.api";
import { notification } from "../../configs/notification.config";
import classes from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EmailIcon from "@mui/icons-material/Email";
import { formatDate } from "../../utils/formatDate";
import { setGlobalLoading } from "../../store/global/globalReducer";

const options = ["Applied", "In Review", "Shortlisted", "Rejected", "Accepted"];

interface JOB_DETAILS extends JOB_TYPE {
  applicantCount: number;
  status: "open" | "closed";
  applied: boolean;
  applicants?: any[];
}

const JobDetails = () => {
  const [jobData, setJobData] = useState<JOB_DETAILS | null>(null);
  const [loading, setLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<null | string>(
    null
  );

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { jobId } = useParams();
  const dispatch = useDispatch();

  const onLoad = async () => {
    if (jobId) {
      const jobDetails = await getJobDetails(jobId);
      setJobData(jobDetails);
      setApplicationStatus(jobDetails.applicants[0].status);
    }
  };

  const handleApply = handleAsync(async () => {
    if (loading || jobData?.applied) {
      return;
    }
    setLoading(true);
    if (jobData) {
      await applyJob(jobData.id);
      setLoading(false);
      notification.success("Successfully applied");
    }
  });

  const handleChangeStatus = handleAsync(
    async (event: SelectChangeEvent<{ value: null | string }>, id: string) => {
      dispatch(setGlobalLoading(true));
      setApplicationStatus(event.target.value as string);
      if (jobData) {
        await changeStatus(jobData.id, id, event.target.value as string);
      }
      notification.success("Status updated successfully");
    },
    () => dispatch(setGlobalLoading(false))
  );

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{ color: "#FFF", p: 3 }}
      className={classes.jobDetailsContainer}
    >
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
          <Box className={classes.logoWithData}>
            <LocationOnIcon fontSize="small" />
            {jobData?.location}
          </Box>
          <Box className={classes.logoWithData}>
            <BusinessCenterIcon fontSize="small" />
            {Number(jobData?.applicantCount) === 0
              ? "No Applicant"
              : Number(jobData?.applicantCount)}
          </Box>
          <Box className={classes.logoWithData}>
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
        {user?.role === "job_seeker" && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            disabled={loading || jobData?.applied}
            sx={{
              bgcolor:
                loading || jobData?.applied ? "#676767 !important" : "#FFF",
              color: "#000",
              fontWeight: 700,
            }}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: "white",
                  width: "25px !important",
                  height: "25px !important",
                }}
              />
            ) : (
              "Apply"
            )}
          </Button>
        )}
        {user?.role === "recruiter" && (
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Applicants
            </Typography>
            <Box>
              {jobData?.applicants?.map((applicant) => (
                <Box
                  sx={{
                    backgroundColor: "#030817",
                    color: "#FFF",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6">{applicant.name}</Typography>
                    <Box>
                      <CloudDownloadIcon />
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", gap: "5px" }}>
                      <EmailIcon />{" "}
                      <Typography variant="h6">{applicant.email}</Typography>
                    </Box>
                    <Box>
                      Skills{" "}
                      {applicant.skills.map((skill: string) => (
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
                  <Divider sx={{ backgroundColor: "#444444", my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>{formatDate(applicant.appliedAt)}</Box>
                    <Box>
                      <FormControl
                        variant="outlined"
                        sx={{
                          minWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#fff", // White border color
                            },
                            "&:hover fieldset": {
                              borderColor: "#fff", // White border on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#fff", // White border on focus
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#fff", // White label on focus
                          },
                        }}
                      >
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={applicationStatus as any}
                          onChange={(event) =>
                            handleChangeStatus(event, applicant.id)
                          }
                          label="Status"
                          sx={{
                            color: "#fff", // Text color
                            "& .MuiSvgIcon-root": {
                              color: "#fff", // Dropdown arrow color
                            },
                          }}
                        >
                          {options.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default JobDetails;
