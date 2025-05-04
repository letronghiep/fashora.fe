import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function uploadImage({ file }) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post(
      `${apiOrigin}/upload/avatar`,
      formData
    );
    const data = await res.data;
    return data;
  } catch (error) {
    return error;
  }
}
