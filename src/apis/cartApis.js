import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
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
  tagTypes: ["cart"],
  endpoints: (builder) => ({
    // Lấy thông tin giỏ hàng
    getCart: builder.query({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["cart"],
      refetchOnMountOrArgChange: true,
    }),

    // Thêm sản phẩm vào giỏ hàng
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),

    // Cập nhật giỏ hàng
    updateCart: builder.mutation({
      query: (data) => ({
        url: "/cart/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),

    // Xóa giỏ hàng
    deleteCart: builder.mutation({
      query: (sku_id) => ({
        url: "/cart" + "/" + sku_id,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem: builder.mutation({
      query: ({  data }) => ({
        url: `/cart/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: builder.mutation({
      query: (cartItemId) => ({
        url: `/cart/items/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    // Thanh toán giỏ hàng
    checkout: builder.mutation({
      query: (data) => ({
        url: "/cart/checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCheckoutMutation,
} = cartApi;

export default cartApi;
