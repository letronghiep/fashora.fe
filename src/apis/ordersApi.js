import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const ordersApi = createApi({
  reducerPath: "/ordersApi",
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
  tagTypes: ["checkout"],
  endpoints: (builder) => ({
    reviewOrder: builder.mutation({
      query: (data) => ({
        url: "/checkout/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["checkout"],
    }),
    getOrders: builder.query({
      query: ({page, limit}) => ({
        url: "/checkout?page=" + page + "&limit=" + limit,
        method: "GET",
      }),
      providesTags: ["checkout"],
    }),
    getOrderDetail: builder.query({
      query: (order_id) => ({
        url: "/checkout/" + order_id,
        method: "GET",
      }),
      providesTags: ["checkout"],
    }),
    checkout: builder.mutation({
      query: (data) => ({
        url: "/checkout/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["checkout"],
    }),
    updateStatus: builder.mutation({
      query: ({data, order_id}) => ({
        url: "/checkout?order_id=" + order_id,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["checkout"],
    }),
    createCheckoutOnline: builder.mutation({
      query: (data) => ({
        url: "/checkout/payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["checkout"],
    }),
    getOrderForAdmin: builder.query({
      query: ({page, limit}) => ({
        url: "/checkout/admin?page=" + page + "&limit=" + limit,
        method: "GET",
      }),
      providesTags: ["checkout"],
    }),
    cancelOrder: builder.mutation({
      query: (order_id) => ({
        url: "/checkout/canceled/" + order_id,
        method: "PATCH",
      }),
    }),
  }),
});
export const {
  useGetOrdersQuery,
  useReviewOrderMutation,
  useCheckoutMutation,
  useUpdateStatusMutation,
  useCreateCheckoutOnlineMutation,
  useGetOrderDetailQuery,
  useGetOrderForAdminQuery,
  useCancelOrderMutation,
} = ordersApi;
export default ordersApi;
