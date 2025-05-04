import { axiosInstance } from "~/core/axiosInstance";

export async function handleLogout() {
  try {
    const res = await axiosInstance.post("/auth/logout");
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
