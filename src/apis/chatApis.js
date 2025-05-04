import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const chatApi = createApi({
  reducerPath: "/chatApi",
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
  tagTypes: ["chat"],
  endpoints: (builder) => ({
    getChatContext: builder.query({
      query: () => ({
        url: `/chat`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),
    createChatContext: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chat"],
    }),
  }),
});
export const {
  useGetChatContextQuery,
  useCreateChatContextMutation,
} = chatApi;
export default chatApi;
