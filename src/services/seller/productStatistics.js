import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "../../constants";

export async function getProductStatistics() {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/analysis/seller/products`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
} 