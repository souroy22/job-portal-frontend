import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/store";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import classes from "./style.module.css";

const TextSection = styled(Box)({
  maxWidth: "600px",
  paddingRight: "20px",
});

const Home = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  return (
    <Box
      display="flex"
      zIndex={99999}
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      p={4}
      sx={{ height: "calc(100svh - 100px)", overflow: "hidden" }}
    >
      <TextSection>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#FFFFFF" }} // White text for visibility
        >
          Find Your Dream Job
        </Typography>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#FFA500" }} // Orange text to match your theme
        >
          Or Hire Top Talent
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#B0B0B0", // Light gray for secondary text
            marginBottom: "20px",
          }}
        >
          Empowering job seekers and recruiters with seamless opportunities.
          Whether you're looking to kickstart your career or hire the best,
          we've got you covered.
        </Typography>
        <Link to={user?.role === "job_seeker" ? "/all-jobs" : "create-job"}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#FFA500",
              color: "#0E0E0E",
              "&:hover": { backgroundColor: "#FF8C00" },
            }}
          >
            Get Started
            <ArrowForwardIcon
              sx={{
                color: "#816464",
                marginLeft: "5px",
                animation: `${classes.moveRight} 1.5s infinite`, // Apply the animation
              }}
            />
          </Button>
        </Link>
      </TextSection>
      <Box sx={{ width: "60%", display: "flex", justifyContent: "center" }}>
        <img
          src="https://unbounce.com/photos/homebanner-smart-traffic-mobile.png"
          alt="Creative"
          style={{
            width: "70%",
            height: "80%",
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;
