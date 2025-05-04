import { apiOrigin } from "../../constants";
import { axiosInstance } from "../../core/axiosInstance";

/**
 * Lấy danh sách đơn hàng
 * @param {Object} params - Tham số tìm kiếm
 * @returns {Promise} - Response data
 */
export async function getOrders(params = {}) {
  try {
    const response = await axiosInstance.get(`${apiOrigin}/checkout`, { params });
    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}

/**
 * Xuất file Excel đơn hàng
 * @param {Object} params - Tham số xuất file
 * @param {string} params.order_status - Trạng thái đơn hàng
 * @param {string} params.startDate - Ngày bắt đầu (optional)
 * @param {string} params.endDate - Ngày kết thúc (optional)
 * @returns {Promise<Blob>} - File blob data
 */
export async function exportOrders({
  order_status,
  startDate,
  endDate,
}) {
  try {
    const params = {
      order_status,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };

    const response = await axiosInstance.get(`${apiOrigin}/checkout/export`, {
      params,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting orders:", error);
    throw error;
  }
}
