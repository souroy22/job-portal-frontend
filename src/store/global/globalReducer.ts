import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customLocalStorage } from "../../utils/customLocalStorage";

type GlobalStateType = {
  theme: string;
  globalLoading: boolean;
};

const initialState: GlobalStateType = {
  theme: "light",
  globalLoading: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUserTheme: (state, action: PayloadAction<string>) => {
      customLocalStorage.setData("userTheme", action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        globalLoading: action.payload,
      };
    },
  },
});

export const { setUserTheme, setGlobalLoading } = globalSlice.actions;
export default globalSlice.reducer;
