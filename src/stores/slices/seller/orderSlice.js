import { createSlice } from "@reduxjs/toolkit";
const INITIAL_STATE = {
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  canceled: 0,
  total: 0,
};
const orderSlice = createSlice({
  name: "order",
  initialState: INITIAL_STATE,
  reducers: {
    setDataOrder: (state, action) => {
      state.pending = action.payload.pending;
      state.processing = action.payload.processing;
      state.shipped = action.payload.shipped;
      state.delivered = action.payload.delivered;
      state.canceled = action.payload.canceled;
      state.total = action.payload.total;
    },
  },
});

export default orderSlice.reducer;
export const { setDataOrder } = orderSlice.actions;
