import { apiOrigin } from "../../constants";
import { axiosInstance } from "../../core/axiosInstance";

export async function getAllCommentForProduct(productId, page, limit) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/comment?productId=${productId}&page=${page}&limit=${limit}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function createComment(content) {
  try {
    const res = await axiosInstance.post(`${apiOrigin}/comment`, content);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
