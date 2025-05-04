import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const vouchersApi = createApi({
  reducerPath: "/vouchersApi",
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
  tagTypes: ["discounts"],
  endpoints: (builder) => ({
    getDiscounts: builder.query({
      query: ({ q, discount_status }) => ({
        url: `/discount?q=${q}&discount_status=${discount_status}`,
        method: "GET",
      }),
      providesTags: ["discounts"],
    }),
    createDiscount: builder.mutation({
      query: (data) => ({
        url: "/discount",
        method: "POST",
        body: data,
        headers: {},
      }),

      invalidatesTags: ["discounts"],
    }),
    getDiscountById: builder.query({
      query: (voucherId) => ({
        url: `/discount/${voucherId}`,
        method: "GET",
      }),
      providesTags: ["discounts"],
    }),
    updateVoucher: builder.mutation({
      query: ({ voucherId, data }) => ({
        url: `/discount/${voucherId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteDiscount: builder.mutation({
      query: (codeId) => ({
        url: `/discount/${codeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["discounts"],
    }),
  }),
});
export const {
  useGetDiscountsQuery,
  useDeleteDiscountMutation,
  useCreateDiscountMutation,
  useGetDiscountByIdQuery,
  useUpdateVoucherMutation,
} = vouchersApi;
export default vouchersApi;
