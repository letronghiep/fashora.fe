import { apiOrigin } from "../../../constants";
import { axiosInstance } from "../../../core/axiosInstance";

export async function getOrderByUser(filter) {
  console.log(filter);
  try {
    const res = await axiosInstance.get(`${apiOrigin}/checkout`, {
      params: filter,
    });
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
