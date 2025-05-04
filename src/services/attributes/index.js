import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getAttributes(category_id) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/attributes?category_id=${category_id}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
