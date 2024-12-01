import { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import handleAsync from "../../utils/handleAsync";
import { getProfileData } from "../../api/user.api";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../../store/global/globalReducer";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  institution: string;
  degree: string;
  yearOfPassing: number;
};

type Preferences = {
  jobType: ("Full-time" | "Part-time" | "Contract")[];
  location: string[];
};

type ProfileData = {
  id: string;
  name: string;
  email: string;
  resume: string;
  expType: "fresher" | "experienced";
  skills: string[];
  experience: Experience[];
  education: Education[];
  preferences: Preferences;
};

const CandidateProfile: FC = () => {
  const [data, setData] = useState<ProfileData | null>(null);

  const dispatch = useDispatch();

  const onLoad = handleAsync(
    async () => {
      dispatch(setGlobalLoading(true));
      const profileData = await getProfileData();
      setData(profileData);
    },
    () => dispatch(setGlobalLoading(false))
  );

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#0d1117",
        color: "#fff",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "800px",
        margin: "auto",
        mt: 4,
        position: "relative",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={3} mb={4}>
        <Avatar
          src="https://via.placeholder.com/120"
          alt="Profile Picture"
          sx={{ width: 120, height: 120 }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {data?.name}
          </Typography>
          <Typography variant="body2" color="gray">
            {data?.email}
          </Typography>
          <Typography variant="body2" fontWeight={700} color="green">
            {data?.expType === "fresher" ? "Fresher" : "Experienced"}
          </Typography>
        </Box>
      </Stack>

      {/* Resume */}
      {data?.resume && (
        <Box mb={4} position="absolute" top="30px" right="30px">
          <Tooltip title="download resume" arrow>
            <Typography
              component="a"
              href={data?.resume!}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <CloudDownloadIcon sx={{ color: "#FFF" }} />
            </Typography>
          </Tooltip>
        </Box>
      )}

      {/* Skills */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Skills
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {data?.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#fff" }}
            />
          ))}
        </Stack>
      </Box>

      {/* Experience */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Experience
        </Typography>
        {data?.experience.map((exp, index) => (
          <Box key={index} mb={3}>
            <Typography fontWeight="bold">{exp.company}</Typography>
            <Typography>
              {exp.role} ({exp.startDate} - {exp.endDate})
            </Typography>
            <Typography variant="body2" color="gray">
              {exp.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ backgroundColor: "#fff", my: 3 }} />

      {/* Education */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Education
        </Typography>
        {data?.education.map((edu, index) => (
          <Box key={index} mb={3}>
            <Typography fontWeight="bold">{edu.institution}</Typography>
            <Typography>
              {edu.degree} (Year of Passing: {edu.yearOfPassing})
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ backgroundColor: "#fff", my: 3 }} />

      {/* Preferences */}
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Preferences
        </Typography>
        <Typography>
          <strong>Job Type:</strong>{" "}
          {data?.preferences.jobType
            ? data.preferences.jobType
            : "Not Specified"}
        </Typography>
        <Typography>
          <strong>Preferred Locations:</strong>{" "}
          {data?.preferences.location
            ? data.preferences.location.join(", ")
            : "Not Specified"}
        </Typography>
      </Box>
    </Box>
  );
};

export default CandidateProfile;
