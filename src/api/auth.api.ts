import AXIOS from "../configs/axios.confog";

export const signup = async (data: { [key: string]: string }) => {
  const res = await AXIOS.post("/auth/signup", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const login = async (data: { [key: string]: string }) => {
  const res = await AXIOS.post("/auth/login", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
