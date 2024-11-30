import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type JOB_TYPE = {
  title: string;
  id: string;
  description: string;
  company: string;
  logo: string;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract";
  salary?: number;
  requirements: string[];
};

type JobStateType = {
  jobs: null | JOB_TYPE[];
};

const initialState: JobStateType = {
  jobs: null,
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<JOB_TYPE[]>) => {
      return {
        ...state,
        jobs: action.payload,
      };
    },
  },
});

export const { setJobs } = jobSlice.actions;
export default jobSlice.reducer;
