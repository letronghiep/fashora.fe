import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getCategoryByParentId(parentId) {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/category?category_parentId=${parentId}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
