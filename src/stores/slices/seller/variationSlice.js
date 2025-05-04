import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  variants: [],
  selectedVariation: [],
  variationData: [],
  headers: ["Phân loại"],
  skuData: [],
  loading: false,
};

const variationSlice = createSlice({
  name: "variation",
  initialState,
  reducers: {
    addVariation: (state) => {
      const newVariation = { id: uuidv4(), display_name: "", variation_id: "", group_list: [] };
      state.variants.push(newVariation);
      state.headers.push(newVariation.display_name);
    },
    changeVariant: (state, action) => {
      const { id, index, variations } = action.payload;
      const foundVariation = variations.find((v) => v.variation_id.toString() === id.toString());

      if (foundVariation) {
        state.variants[index] = {
          ...state.variants[index],
          ...foundVariation,
        };
        state.selectedVariation[index] = {
          ...foundVariation,
          group_list: [],
        };
      }
    },
    changeVariantValue: (state, action) => {
      const { value, index, variations } = action.payload;
      const value_list = variations
        .flatMap((v) => v.group_list)
        .flatMap((group) => group.value_list)
        .filter((va) => value.includes(va.value_id));

      if (state.selectedVariation[index]) {
        state.selectedVariation[index].group_list = value_list;
      }
    },
    deleteVariation: (state, action) => {
      const variant = action.payload;
      state.variants = state.variants.filter((v) => v.id !== variant.id);
      state.selectedVariation = state.selectedVariation.filter((v) => v.variation_id !== variant.variation_id);
    },
    initializeVariation: (state) => {
      const headers = state.selectedVariation.map((item) => item.display_name);
      state.headers = headers;

      const combine = (arr1, arr2) =>
        arr1.length === 0 ? arr2.map((item) => [item]) : arr1.flatMap((a) => arr2.map((b) => [...a, b]));

      const allCombinations = state.selectedVariation.reduce(
        (acc, variation) => combine(acc, variation.group_list),
        []
      );

      state.variationData = allCombinations.map((combination) => {
        const variationObj = {};
        combination.forEach((value, index) => {
          variationObj[headers[index]] = value.value_name;
        });
        return { ...variationObj, price: "", stock: "", sku: "" };
      });

      state.skuData = allCombinations.map((combination) => {
        const variationObj = {};
        combination.forEach((value, index) => {
          variationObj[headers[index]] = value.value_id;
        });
        return { ...variationObj, price: "", stock: "", sku: "" };
      });
    },
  },
});

export const { addVariation, changeVariant, changeVariantValue, deleteVariation, initializeVariation } =
  variationSlice.actions;
export default variationSlice.reducer;
