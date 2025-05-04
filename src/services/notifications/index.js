import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "~/constants";

export async function getNotification(userId, isAll, isRead) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/notifications?user_id=${userId}&isAll=${isAll}&isRead=${isRead}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function readNotification(notify_id, isRead) {
  try {
    const res = await axiosInstance.patch(
      `${apiOrigin}/notifications/${notify_id}?isRead=${isRead}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function countNotification(isRead, isAll) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/notifications/count?isRead=${isRead}&isAll=${isAll}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
