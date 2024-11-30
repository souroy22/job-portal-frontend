import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";

interface JobCardProps {
  title: string;
  location: string;
  description: string;
  logo: string;
  jobId: string;
  applied: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  logo,
  location,
  description,
  applied,
  jobId,
}) => {
  return (
    <Card
      sx={{
        width: 345,
        backgroundColor: "#030817",
        color: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "10px",
          color: "green",
          fontWeight: 600,
        }}
      >
        {applied ? "Applied" : null}
      </Box>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <img src={logo} width="85px" height="40px" />
          <Typography
            variant="body2"
            sx={{
              color: "#cccccc",
              mt: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "5px",
              fontSize: "17px",
            }}
          >
            <LocationOnIcon fontSize="small" />
            {location}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#444444", my: 2 }} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          {description.length > 200
            ? description.slice(0, 200) + "..."
            : description}
        </Typography>
        <Link to={`/job-details/${jobId}`}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#1B2637",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#005FCC",
              },
            }}
          >
            More Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default JobCard;
