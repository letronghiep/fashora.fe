import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";

export async function createShipping(shipping) {
  try {
    const res = await axiosInstance.post(`${apiOrigin}/shipping`, shipping);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getShipping() {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/shipping`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getShippingDetail(shippingId) {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/shipping/${shippingId}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateShipping(shippingId, shipping) {
  try {
    const res = await axiosInstance.patch(
      `${apiOrigin}/shipping/${shippingId}`,
      shipping
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function removeShippingService(shippingId) {
  // Delete logic here
  const res = await axiosInstance.delete(
    `${apiOrigin}/shipping/${shippingId}`
  );
  const data = await res.data;
  return data;
}

export async function updateDefaultShipping(shippingId) {
  try {
    const res = await axiosInstance.patch(
      `${apiOrigin}/shipping/default/${shippingId}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}