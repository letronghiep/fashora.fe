import { axiosInstance } from "../core/axiosInstance";

export const getBanners = async () => {
  const response = await axiosInstance.get("/banners");
  return response.data;
};

export const getBannerById = async (id) => {
  const response = await axiosInstance.get(`/banners/${id}`);
  return response.data;
};

export const createBanner = async (data) => {
  const response = await axiosInstance.post("/banners", data);
  return response.data;
};

export const updateBanner = async (id, data) => {
  const response = await axiosInstance.put(`/banners/${id}`, data);
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await axiosInstance.delete(`/banners/${id}`);
  return response.data;
};