import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const productsApi = createApi({
  reducerPath: "/productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const client_id = localStorage.getItem("client_id");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (client_id) {
        headers.set("x-client-id", `${client_id}`);
      }
      return headers;
    },
  }),
  tagTypes: ["products"],
  endpoints: (builder) => ({
    getHomepage: builder.query({
      query: () => ({
        url: "/product/homepage",
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    getArrivals: builder.query({
      query: () => ({
        url: "/product/arrivals",
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    searchProduct: builder.query({
      query: ({
        q,
        product_status,
        product_category,
        limit,
        currentPage,
        sort,
        product_price,
        size,
        color,
      }) => ({
        url: `/product/search?q=${q}&product_price=${product_price}&size=${size}&color=${color}&product_status=${product_status}&product_category=${product_category}&limit=${limit}&currentPage=${currentPage}&sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/seller/${id}`,
        method: "DELETE",
      }),
    }),
    getFavoriteProducts: builder.query({
      query: () => ({
        url: "/product/favorite",
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: ({id, data}) => ({
        url: `/product/seller/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateProductStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/seller/status/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updatePriceProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/seller/price/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    getInventoriesProduct: builder.query({
      query: ({page, limit}) => ({
        url: `/inventory?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetHomepageQuery,
  useGetArrivalsQuery,
  useSearchProductQuery,
  useDeleteProductMutation,
  useGetFavoriteProductsQuery,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useUpdatePriceProductMutation,
  useGetInventoriesProductQuery,
} = productsApi;
export default productsApi;
