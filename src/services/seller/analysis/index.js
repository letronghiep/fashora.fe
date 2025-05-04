import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function analysisSeller({ startDate, endDate, type }) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/analysis/seller?startDate=${startDate}&endDate=${endDate}&type=${type}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function exportRevenueToCSV({ startDate, endDate, type }) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/analysis/seller/export?startDate=${startDate}&endDate=${endDate}&type=${type}`,
      {
        responseType: "blob",
        headers: {
          "Content-Type":
            "application/csv, text/csv, application/vnd.ms-excel, application/x-csv, text/x-csv, text/plain, application/octet-stream, application/csv, application/excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
