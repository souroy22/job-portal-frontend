import AXIOS from "../configs/axios.confog";

export const getUserData = async () => {
  const res = await AXIOS.get("/user/get-user");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getProfileData = async () => {
  const res = await AXIOS.get("/user/profile");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateRole = async (role: "job_seeker" | "recruiter") => {
  const res = await AXIOS.patch("/user/update-role", { newRole: role });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
