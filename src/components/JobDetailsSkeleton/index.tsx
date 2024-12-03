import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Button,
  CircularProgress,
} from "@mui/material";

const JobDetailsSkeleton = () => {
  return (
    <Box sx={{ padding: 2 }}>
      {/* Floating Chat Button Skeleton */}
      <Box
        sx={{
          position: "fixed",
          bottom: "30px",
          right: "70px",
          zIndex: "999999",
        }}
      >
        <Skeleton
          sx={{ bgcolor: "#1C1F22 !important" }}
          variant="circular"
          width={50}
          height={50}
        />
      </Box>

      <Stack spacing={3}>
        {/* Job Title and Logo */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton
            variant="text"
            width="60%"
            height={40}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={50}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
        </Box>

        {/* Location and Status */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton
            variant="text"
            width="30%"
            height={20}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={20}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={20}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
        </Box>

        {/* Job Type */}
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Skeleton
            variant="text"
            width="20%"
            height={30}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={30}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
        </Box>

        {/* Key Skills */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Key Skills
          </Typography>
          <Box sx={{ display: "flex", gap: "20px" }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={100}
                height={40}
                sx={{ bgcolor: "#1C1F22 !important" }}
              />
            ))}
          </Box>
        </Box>

        {/* Job Description */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Job Description
          </Typography>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            sx={{ bgcolor: "#1C1F22 !important" }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default JobDetailsSkeleton;
