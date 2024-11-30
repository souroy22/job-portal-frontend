import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import AUTH_IMAGE from "../../assets/images/undraw_interview_re_e5jn.svg";
import classes from "./style.module.css";

type PropTypes = {
  children: ReactNode | null;
};

const AuthLayout: FC<PropTypes> = ({ children }) => {
  return (
    <Box className={classes.authLayout}>
      <Box className={classes.authImageContainer}>
        <img src={AUTH_IMAGE} className={classes.authImage} />
      </Box>
      <Box className={classes.childContainer}>{children}</Box>
    </Box>
  );
};

export default AuthLayout;
