import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const categoriesApi = createApi({
  reducerPath: "/categoriesApi",
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
  tagTypes: ["categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    searchCategories: builder.query({
      query: ({ q, category_status }) => ({
        url: `/category/search?q=${q}&category_status=${category_status}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
        headers: {},
      }),

      invalidatesTags: ["categories"],
    }),
    getCategoryById: builder.query({
      query: (categoryId) => ({
        url: `/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/category/${categoryId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useSearchCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoriesApi;
export default categoriesApi;
