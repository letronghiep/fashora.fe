import { axiosInstance } from "../../core/axiosInstance";

export async function createInventoryTransaction(data) {
  const response = await axiosInstance.post(
    "/inventory-transactions",
    data
  );
  return response.data;
}

export default {
  createInventoryTransaction,
};
