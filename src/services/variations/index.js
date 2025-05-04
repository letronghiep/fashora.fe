import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getVariations(category_id) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/variations?category_id=${category_id}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
