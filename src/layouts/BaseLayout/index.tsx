import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import "./style.css";
import Navbar from "../../components/Navbar";

type PropTypes = {
  children: ReactNode | null;
};

const BaseLayout: FC<PropTypes> = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          height: "calc(100svh - 100px)",
          overflowY: "auto",
          marginTop: "30px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BaseLayout;
