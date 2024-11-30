import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import classes from "./style.module.css";
import LOGO from "../../assets/images/9166962.png";
import { customLocalStorage } from "../../utils/customLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../store/user/userReducer";
import { RootState } from "../../store/store";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    customLocalStorage.deleteData("token");
    dispatch(setUserData(null));
    navigate("/signin");
    handleMenuClose();
  };

  const hasNotifications = true;

  return (
    <Box className={classes.navbarContainer}>
      {/* Logo Section */}
      <Link to="/">
        <Box>
          <img src={LOGO} className={classes.logoImage} alt="Logo" />
        </Box>
      </Link>

      {/* Avatar with Dropdown */}
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {user?.role === "job_seeker" && (
          <Link to="/all-jobs">
            <Button variant="outlined" className={classes.navbarBtn}>
              All Jobs
            </Button>
          </Link>
        )}
        {user?.role === "job_seeker" && (
          <Link to="/recommended-jobs">
            <Button variant="outlined" className={classes.navbarBtn}>
              Recommended Jobs
            </Button>
          </Link>
        )}
        {user?.role === "recruiter" && (
          <Link to="/create-job">
            <Button variant="outlined" className={classes.navbarBtn}>
              Create Job
            </Button>
          </Link>
        )}
        {user?.role === "recruiter" && (
          <Link to="/posted-jobs">
            <Button variant="outlined" className={classes.navbarBtn}>
              Posted Jobs
            </Button>
          </Link>
        )}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <NotificationsIcon
            sx={{
              color: "#FFF",
              animation: hasNotifications
                ? `${classes.shake} 0.5s infinite`
                : "none",
            }}
          />
          {hasNotifications && (
            <Box
              sx={{
                position: "absolute",
                top: "0px",
                right: "0px",
                width: "10px",
                height: "10px",
                backgroundColor: "red",
                borderRadius: "50%",
                // border: "2px solid #FFF",
              }}
            />
          )}
        </Box>

        <Avatar
          sx={{ cursor: "pointer" }}
          onClick={handleMenuOpen}
          src="/path-to-avatar.jpg" // Replace with your avatar image path
          alt={user?.name}
        />
        <Menu
          id="avatar-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
