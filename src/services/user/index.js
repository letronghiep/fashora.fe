import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getMe() {
  try {
    const response = await axiosInstance.get(`${apiOrigin}/user/me`);
    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
}
export async function updateUserToShop(user) {
  try {
    const res = await axiosInstance.post(`${apiOrigin}/user/seller`, user);
    const data = await res.data;
    return data;
  } catch (error) {
    return error;
  }
}
export async function updateUserInfo(userId, user) {
  try {
    const res = await axiosInstance.put(
      `${apiOrigin}/user/update/${userId}`,
      user
    );
    const data = await res.data;
    return data;
  } catch (error) {
    return error;
  }
}

export async function uploadUserAvatar(formData) {
  try {
    const res = await axiosInstance.post(`/upload/avatar`, formData);
    if (res.status === 200) {
      const data = await res.data;
      return data;
    }
  } catch (error) {
    return error;
  }
}
