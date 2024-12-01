import AXIOS from "../configs/axios.confog";

export const applyJob = async (jobId: string) => {
  const res = await AXIOS.post("/application/apply", { jobId });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const changeStatus = async (
  jobId: string,
  applicant: string,
  status: string
) => {
  const res = await AXIOS.patch("/application/change-status", {
    jobId,
    applicant,
    status,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
