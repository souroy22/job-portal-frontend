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
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { setJobData } from "../../store/job/jobReducer";
import { getJobDetails, updateJobStatus } from "../../api/job.api";
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
import MarkdownPreview from "@uiw/react-markdown-preview";
import { steps } from "../../assets/data";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "../../components/Chat";
import { io, Socket } from "socket.io-client";

const options = ["Applied", "In Review", "Shortlisted", "Rejected", "Accepted"];
const applicationStatusOptions = [
  { label: "Open", value: "open" },
  { label: "Close", value: "closed" },
];

const JobDetails = () => {
  const [loading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState("open");
  const [open, setOpen] = useState(false);
  const [otherUserId, setOtherUserId] = useState("");
  const [receiverDetails, setReceiverDetails] = useState({
    name: "",
    email: "",
  });

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { jobData } = useSelector((state: RootState) => state.jobReducer);

  const { jobId } = useParams();
  const dispatch = useDispatch();

  const socket: Socket = useMemo(
    () =>
      io(
        import.meta.env.VITE_HOST === "localhost"
          ? import.meta.env.VITE_LOCAL_BASE_URL
          : import.meta.env.VITE_PROD_BASE_URL,
        {
          transports: ["websocket", "polling"],
        }
      ),
    []
  );

  const onLoad = async () => {
    if (jobId) {
      const jobDetails = await getJobDetails(jobId);
      dispatch(setJobData(jobDetails));
      setJobStatus(jobDetails.status);
      socket.on("job-status-updated", (data) => {
        console.log("Data ---------", data);
        console.log("jobData", jobData);
        console.log("user", user);
        console.log("jobData?.id === data.jobId", jobData?.id === data.jobId);
        console.log("user?.id === data.userId", user?.id === data.userId);

        if (jobId === data.jobId && user?.id === data.userId) {
          dispatch(
            setJobData({
              ...jobData,
              applicationStatus: data.newStatus,
            } as any)
          );
        }
      });
    }
  };

  const handleApply = handleAsync(async () => {
    if (loading || jobData?.applied) {
      return;
    }
    setLoading(true);
    if (jobData) {
      await applyJob(jobData.id);
      dispatch(
        setJobData({
          ...jobData,
          applied: true,
          applicantCount: jobData.applicantCount + 1,
          applicationStatus: "Applied",
        })
      );
      setLoading(false);
      notification.success("Successfully applied");
    }
  });

  const handleChangeStatus = handleAsync(
    async (value: string, id: string, index: number) => {
      dispatch(setGlobalLoading(true));
      if (jobData) {
        await changeStatus(jobData.id, id, value);
        socket.emit("update-job-status", {
          jobId: jobData.id,
          userId: id,
          newStatus: value,
        });
      }
      if (jobData?.applicants?.length) {
        const applicants = JSON.parse(JSON.stringify(jobData?.applicants));
        applicants[index].status = value;
        dispatch(setJobData({ ...jobData, applicants }));
      }
      notification.success("Status updated successfully");
    },
    () => dispatch(setGlobalLoading(false))
  );

  const handleChangeJobStatus = handleAsync(
    async (value: string) => {
      dispatch(setGlobalLoading(true));
      setJobStatus(value);
      await updateJobStatus(jobData?.id!, value);
      notification.success("Job Status updated successfully");
    },
    () => dispatch(setGlobalLoading(false))
  );

  const closeChat = () => {
    setOpen(false);
    setReceiverDetails({ name: "", email: "" });
    setOtherUserId("");
  };

  useEffect(() => {
    onLoad();
  }, [jobData]);

  return (
    <Container
      maxWidth="lg"
      sx={{ color: "#FFF", p: 3 }}
      className={classes.jobDetailsContainer}
    >
      <Box
        sx={{
          position: "fixed",
          bottom: "30px",
          right: "70px",
          zIndex: "999999 !important",
        }}
      >
        {!open && user?.role === "job_seeker" && (
          <ChatIcon
            sx={{
              width: "50px !important",
              height: "50px !important",
              color: "orange",
              cursor: "pointer",
            }}
            onClick={() => {
              setReceiverDetails({
                name: jobData?.recruiterDetails.name!,
                email: jobData?.recruiterDetails.email!,
              });
              setOtherUserId(jobData?.recruiterId!);
              setOpen(true);
            }}
          />
        )}
        {open && (
          <Chat
            otherUserId={otherUserId}
            userId={user?.id!}
            receiverDetails={receiverDetails}
            onClose={closeChat}
            socket={socket}
          />
        )}
      </Box>
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
          {user?.role === "job_seeker" ? (
            <Box className={classes.logoWithData}>
              <BlindsIcon fontSize="small" />
              {jobData?.status === "open" ? "Open" : "Closed"}
            </Box>
          ) : (
            <Box>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff",
                  },
                }}
              >
                <InputLabel shrink>Status</InputLabel>
                <Select
                  value={jobStatus as any}
                  onChange={(event) =>
                    handleChangeJobStatus(event.target.value)
                  }
                  // label="Status"
                  sx={{
                    color: "#fff",
                    "& .MuiSvgIcon-root": {
                      color: "#fff",
                    },
                  }}
                >
                  {applicationStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
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
        {user?.role === "job_seeker" && jobData?.applied && (
          <Box sx={{ width: "100%" }}>
            <Stepper>
              {steps.map((label, index) => {
                const currentStepIndex = steps.indexOf(
                  jobData?.applicationStatus ?? ""
                );
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <Step key={label} active={isCurrent}>
                    <StepLabel
                      sx={{
                        color: isCompleted
                          ? "green !important"
                          : isCurrent
                          ? "orange !important"
                          : "gray !important",
                        "& .MuiStepLabel-label": {
                          color: isCompleted
                            ? "green !important"
                            : isCurrent
                            ? "orange !important"
                            : "gray !important",
                          fontWeight: isCurrent
                            ? "bold !important"
                            : "normal !important",
                        },
                        "& .MuiStepIcon-root": {
                          color: isCompleted
                            ? "green !important"
                            : isCurrent
                            ? "orange !important"
                            : "gray !important", // Change step icon color
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
        )}

        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Job Description
          </Typography>
          <MarkdownPreview
            source={jobData?.description}
            style={{ padding: 16 }}
          />
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
            {!jobData?.applicants?.length ? (
              <Typography variant="h6" sx={{ color: "red" }} gutterBottom>
                No One applied
              </Typography>
            ) : (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
              >
                {jobData?.applicants?.map((applicant, index) => (
                  <Box
                    sx={{
                      backgroundColor: "#030817",
                      color: "#FFF",
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      borderRadius: "10px",
                      position: "relative",
                    }}
                  >
                    <ChatIcon
                      sx={{
                        width: "30px !important",
                        height: "30px !important",
                        color: "white",
                        cursor: "pointer",
                        position: "absolute",
                        top: "20px",
                        right: "100px",
                      }}
                      onClick={() => {
                        setReceiverDetails({
                          name: applicant.name,
                          email: applicant.email,
                        });
                        setOtherUserId(applicant.id);
                        setOpen(true);
                      }}
                    />
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
                      <Box
                        sx={{
                          width: "60%",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom textAlign="end">
                            Skills
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            {applicant.skills.map((skill: string) => (
                              <Chip
                                label={skill}
                                sx={{
                                  bgcolor: "#0a267c",
                                  color: "#FFF",
                                  fontWeight: 700,
                                  textShadow:
                                    "0px 0px 8px rgba(255, 255, 255, 0.8)",
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
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
                          <InputLabel shrink>Status</InputLabel>
                          <Select
                            value={applicant.status}
                            sx={{
                              color: "#fff", // Text color
                              "& .MuiSvgIcon-root": {
                                color: "#fff", // Dropdown arrow color
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                value={option}
                                selected={option === applicant.status}
                                onClick={() =>
                                  handleChangeStatus(
                                    option,
                                    applicant.id,
                                    index
                                  )
                                }
                              >
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
            )}
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default JobDetails;
