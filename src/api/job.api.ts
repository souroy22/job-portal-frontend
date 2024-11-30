import AXIOS from "../configs/axios.confog";

export const createJob = async (data: any) => {
  const res = await AXIOS.post("/job/create", data);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getAllJobs = async (
  searchQuery: string = "",
  location: string = "",
  jobType: string = ""
) => {
  const params: any = {};
  if (searchQuery?.trim()) {
    params["searchQuery"] = searchQuery;
  }
  if (location?.trim()) {
    params["location"] = location;
  }
  if (jobType?.trim()) {
    params["jobType"] = jobType;
  }
  const res = await AXIOS.get("/job/all", { params });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getJobDetails = async (jobId: string) => {
  const res = await AXIOS.get(`/job/details/${jobId}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};