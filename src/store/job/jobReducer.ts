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
  applied: boolean;
};

interface JOB_DETAILS extends JOB_TYPE {
  applicantCount: number;
  status: "open" | "closed";
  applied: boolean;
  applicants?: any[];
  applicationStatus: string;
  recruiterId?: string;
  recruiterDetails: { name: string; email: string };
}

type JobStateType = {
  jobs: null | JOB_TYPE[];
  jobData: JOB_DETAILS | null;
};

const initialState: JobStateType = {
  jobs: null,
  jobData: null,
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
    setJobData: (state, action: PayloadAction<JOB_DETAILS>) => {
      return {
        ...state,
        jobData: action.payload,
      };
    },
  },
});

export const { setJobs, setJobData } = jobSlice.actions;
export default jobSlice.reducer;
