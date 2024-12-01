import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Stack, Chip, Link } from "@mui/material";
import handleAsync from "../../utils/handleAsync";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../../store/global/globalReducer";
import { getProfileData } from "../../api/user.api";

interface CompanyData {
  name: string;
  slug: string;
  description: string;
  industry: string;
  logo: string;
  website: string;
  location: string[];
}

const RecruiterProfile: React.FC = () => {
  const [data, setData] = useState<CompanyData | null>(null);

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

  // Static data
  //   const data = {
  //     name: "Tech Innovations",
  //     slug: "tech-innovations",
  //     description: "A leading company in AI and machine learning solutions.",
  //     industry: "Technology",
  //     logo: "https://via.placeholder.com/120",
  //     website: "https://techinnovations.com",
  //     location: ["New York, USA", "London, UK", "Berlin, Germany"],
  //   };

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
      }}
    >
      {/* Header Section */}
      <Stack direction="row" spacing={3} alignItems="center" mb={4}>
        <Avatar
          src={data?.logo || "https://via.placeholder.com/120"}
          alt="Company Logo"
          sx={{
            width: 120,
            height: 120,
            "& img": {
              objectFit: "scale-down",
            },
          }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {data?.name}
          </Typography>
        </Box>
      </Stack>

      {/* Description Section */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Description
        </Typography>
        <Typography>{data?.description}</Typography>
      </Box>

      {/* Industry Section */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Industry
        </Typography>
        <Typography>{data?.industry}</Typography>
      </Box>

      {/* Locations Section */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Locations
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {data?.location.map((loc, index) => (
            <Chip
              key={index}
              label={loc}
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#fff" }}
            />
          ))}
        </Stack>
      </Box>

      {/* Website Section */}
      {data?.website && (
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Website
          </Typography>
          <Link
            href={data.website}
            target="_blank"
            rel="noopener"
            color="primary"
          >
            {data.website}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default RecruiterProfile;
