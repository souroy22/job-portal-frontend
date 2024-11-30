import { FC, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import useThemeMode from "./hooks/useThemeMode";
import RouterComponent from "./routers/router";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { notification } from "./configs/notification.config";
import { getUserData } from "./api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./store/user/userReducer";
import { CustomError } from "./types";
import { RootState } from "./store/store";
import FallBack from "./components/FallBack";
import Loading from "./components/Loading";

const App: FC = () => {
  const { theme } = useThemeMode();

  const { globalLoading } = useSelector(
    (state: RootState) => state.globalReducer
  );

  const dispatch = useDispatch();

  const muiTheme = createTheme({
    palette: {
      mode: theme as "light" | "dark",
    },
  });

  const onLoad = async () => {
    try {
      const userData = await getUserData();
      dispatch(setUserData(userData.user));
    } catch (error) {
      if (error instanceof Error) {
        const customError = error as CustomError;
        if (customError.status !== 401) {
          notification.error(customError.message);
        }
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Toaster />
      {<Loading open={globalLoading} />}
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
