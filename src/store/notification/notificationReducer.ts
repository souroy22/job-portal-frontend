import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NOTIFICATION_TYPE = {
  message: string;
  url: string;
  createdAt: string;
  isRead: boolean;
  id: string;
};

type UserStateType = {
  notifications: null | NOTIFICATION_TYPE[];
};

const initialState: UserStateType = {
  notifications: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<null | NOTIFICATION_TYPE[]>
    ) => {
      return {
        ...state,
        notifications: action.payload,
      };
    },
    addNewNotification: (state, action: PayloadAction<NOTIFICATION_TYPE>) => {
      if (state.notifications) {
        return {
          ...state,
          notifications: [action.payload, ...state.notifications],
        };
      }
      return {
        ...state,
        notifications: [action.payload],
      };
    },
  },
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
