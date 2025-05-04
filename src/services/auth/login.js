import { axiosInstance } from "../../core/axiosInstance";
export async function login(formData) {
  // Implement login logic here
  try {
    const response = await axiosInstance.post(`/auth/login`, formData);
    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function register(formData) {
  // Implement login logic here
  try {
    const response = await axiosInstance.post(`/auth/signup`, formData);
    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function handleRefreshToken() {
  try {
    const response = await axiosInstance.post("/auth/refreshToken");
    if (response.status === 200) {
      const data = await response.data;
      return data;
    }
  } catch (error) {
    return error;
  }
}
