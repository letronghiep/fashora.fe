import { axiosInstance } from "../../core/axiosInstance";

export async function getDiscountByShop() {
  try {
    const res = await axiosInstance.get("/discount");
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
