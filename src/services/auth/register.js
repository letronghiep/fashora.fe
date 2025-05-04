import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";

export async function registerUser(formData) {
  // Implement login logic here
  try {
    const response = await axiosInstance.post(
      `${apiOrigin}/auth/signup`,
      formData
    );
    const data = await response.data;
    return data;
  } catch (error) {
       return error

  }
}
