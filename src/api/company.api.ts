import AXIOS from "../configs/axios.confog";

export const getCompanyDetails = async () => {
  const res = await AXIOS.get("/company/details");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
