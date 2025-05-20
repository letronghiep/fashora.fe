export const handleConvertDatetime = (datetime) => {
  const date = new Date(datetime);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    formattedDate: `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`,
  };
};
export const checkMaxSizeFile = (file) => {
  const maxSize = 1 * 1024 * 1024; // size = 1MB;
  if (file) {
    const size = file.size;
    if (size > maxSize) return false;
    return true;
  }
};
export const validateFormMoney = (money) => {
  return money.toLocaleString({
    style: "currency",
    currency: "VND",
  });
};
export function modifyImageDimensions(url, newHeight, newWidth) {
  return url.replace(/h_\d+,w_\d+/, `h_${newHeight},w_${newWidth}`);
}
export function normalize(str) {
  return str
    .split(",") // Tách theo dấu phẩy
    .map((s) => s.trim().toLowerCase()) // Xóa khoảng trắng và viết thường
    .sort() // Sắp xếp lại
    .join(","); // Ghép lại
}
export function areEqual(str1, str2) {
  return normalize(str1) === normalize(str2);
}
