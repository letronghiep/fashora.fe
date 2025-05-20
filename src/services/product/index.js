import { axiosInstance } from "~/core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getProductByShop(query) {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/product/seller?${query}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function createProduct(body) {
  try {
    const res = await axiosInstance.post(`${apiOrigin}/product/seller`, body);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getProductData(productId) {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/product/${productId}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function searchProductService(
  q,
  product_status,
  product_category,
  page,
  limit,
  sortBy
) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/product/search?q=${q}&product_status=${product_status}&product_category=${product_category}&page=${page}&offset=${limit}&sort_by=${sortBy}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getRelatedProducts(productId) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/product/related/${productId}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getInfoProduct(product_slug) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/product/info/${product_slug}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function addProductToWishList(productId, customer_id) {
  try {
    const res = await axiosInstance.patch(
      `${apiOrigin}/product/wishlist/${productId}?customer_id=${customer_id}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function increaseViewProduct(productId) {
  try {
    const res = await axiosInstance.patch(
      `${apiOrigin}/product/view/${productId}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function updateFavoriteProduct(productId, customer_id) {
  try {
    const res = await axiosInstance.patch(
      `${apiOrigin}/product/favorite/${productId}?customer_id=${customer_id}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getCountFavorite(productId) {
  try {
    const res = await axiosInstance.get(
      `${apiOrigin}/product/favorite/${productId}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getFlashSaleProducts(page, limit) {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/product/flashsale?page=${page}&limit=${limit}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}