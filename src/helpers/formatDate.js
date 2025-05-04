import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("vi");
export const formatTime = (date) => {
  const now = dayjs();
  const targetDate = dayjs(date);

  if (now.diff(targetDate, "day") < 1) {
    // Trong vòng 1 ngày
    return targetDate.fromNow(); // "3 giờ trước", "vài phút trước", ...
  } else if (now.diff(targetDate, "week") < 1) {
    return `${now.diff(targetDate, "day")} ngày trước`;
  } else {
    return targetDate.format("DD/MM/YYYY");
  }
};
export function formatDate(date, format) {
  return dayjs(date).format(format);
}
