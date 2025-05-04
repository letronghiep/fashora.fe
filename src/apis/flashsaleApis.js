import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const flashsaleApi = createApi({
  reducerPath: "/flashsaleApi",
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
  tagTypes: ["flashsale"],
  endpoints: (builder) => ({
    getFlashsale: builder.query({
      query: () => ({
        url: `/flashsale`,
        method: "GET",
      }),
      providesTags: ["flashsale"],
    }),
    getFlashsaleById: builder.query({
      query: (id) => ({
        url: `/flashsale/${id}`,
        method: "GET",
      }),
    }),
    createFlashsale: builder.mutation({
      query: (data) => ({
        url: "/flashsale",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["flashsale"],
    }),
    deleteFlashsale: builder.mutation({
      query: (id) => ({
        url: `/flashsale/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetFlashsaleQuery,
  useCreateFlashsaleMutation,
} = flashsaleApi;
export default flashsaleApi;
