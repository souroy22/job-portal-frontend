import { Box, Button, Typography } from "@mui/material";
import classes from "./style.module.css";
import handleAsync from "../../utils/handleAsync";
import { updateRole } from "../../api/user.api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userReducer";
import { setGlobalLoading } from "../../store/global/globalReducer";
import { useNavigate } from "react-router-dom";

const SetRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = handleAsync(
    async (role: "job_seeker" | "recruiter") => {
      dispatch(setGlobalLoading(true));
      const data = await updateRole(role);
      dispatch(setUserData(data.user));
      navigate("/profile");
    },
    () => {
      dispatch(setGlobalLoading(false));
    }
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: "30px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        height: "calc(100svh - 100px)",
      }}
    >
      <Typography fontSize={50} className={classes.textGlow}>
        I am a...
      </Typography>
      <Box sx={{ display: "flex", gap: "30px", justifyContent: "center" }}>
        <Button
          className={`${classes.btn} ${classes.candidateBtn}`}
          onClick={() => handleClick("job_seeker")}
        >
          Candidate
        </Button>
        <Button
          className={`${classes.btn} ${classes.recruiterBtn}`}
          onClick={() => handleClick("recruiter")}
        >
          Recruiter
        </Button>
      </Box>
    </Box>
  );
};

export default SetRole;
