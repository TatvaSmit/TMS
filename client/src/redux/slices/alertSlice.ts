import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AlertState {
  message: string;
  type: "success" | "error" | "info" | "warning";
  open: boolean;
}

const initialState: AlertState = {
  message: "",
  type: "info",
  open: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{ message: string; type: AlertState["type"] }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = true;
    },
    hideAlert: (state) => {
      state.open = false;
      state.message = "";
    },
    clearAlert: () => initialState,
  },
});

export const { showAlert, hideAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
