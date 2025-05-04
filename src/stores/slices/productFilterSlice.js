import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product_category: [],
  size: "",
  color: "",
  product_price: [50000, 2000000],
  //   brand: "",
  sortBy: "default",
  loading: false,
  error: null,
};

const productFilterSlice = createSlice({
  name: "productFilter",
  initialState,
  reducers: {
    toggleCategory: (state, action) => {
      const product_category = action.payload;
      if (state.product_category.includes(parseInt(product_category))) {
        state.product_category = state.product_category.filter((c) => c !== parseInt(product_category));
      } else {
        state.product_category.push(parseInt(product_category));
      }
    },
    setPriceRange: (state, action) => {
      state.product_price = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    // setBrand: (state, action) => {
    //   state.brand = action.payload;
    // },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: () => initialState,

    saveFiltersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveFiltersSuccess: (state) => {
      state.loading = false;
    },
    saveFiltersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Thunk để gọi API khi nhấn Save
// export const saveFilters = (filters) => async (dispatch) => {
//   try {
//     dispatch(productFilterSlice.actions.saveFiltersStart());
//     await axios.post("https://api.example.com/save-filters", filters);
//     dispatch(productFilterSlice.actions.saveFiltersSuccess());
//   } catch (error) {
//     dispatch(productFilterSlice.actions.saveFiltersFailure(error.message));
//   }
// };
// Export actions
export const {
  toggleCategory,
  setPriceRange,
  setSize,
  setColor,
  setSortBy,
  resetFilters,
} = productFilterSlice.actions;
export default productFilterSlice.reducer;
