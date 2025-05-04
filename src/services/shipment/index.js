import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getShipment() {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/shipment`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
