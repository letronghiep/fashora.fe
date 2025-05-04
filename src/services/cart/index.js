import { apiOrigin } from "../../constants";
import { axiosInstance } from "../../core/axiosInstance";

export async function addToCart(body) {
  try {
    const res = await axiosInstance.post(`${apiOrigin}/cart`, body);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
