import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getBanners() {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/banner`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function createBanner(data) {
  try {
    const res = await axiosInstance.post(`${apiOrigin}/banner`, data);
    const responseData = await res.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
}

