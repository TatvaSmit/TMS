import { Middleware } from "@reduxjs/toolkit";
import { showAlert } from "../slices/alertSlice";
import { clearAuthState } from "../slices/authSlice";
import { clearBoardState } from "../slices/boardSlice";

export const alertMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    action.type.startsWith("alert/")
  ) {
    return result;
  }

  const state = store.getState();

  if (state.auth?.success) {
    store.dispatch(showAlert({ message: state.auth.success, type: "success" }));
    store.dispatch(clearAuthState());
  }
  if (state.auth?.error) {
    store.dispatch(showAlert({ message: state.auth.error, type: "error" }));
    store.dispatch(clearAuthState());
  }

  if (state.board?.success) {
    store.dispatch(
      showAlert({ message: state.board.success, type: "success" })
    );
    store.dispatch(clearBoardState());
  }
  if (state.board?.error) {
    store.dispatch(showAlert({ message: state.board.error, type: "error" }));
    store.dispatch(clearBoardState());
  }

  return result;
};
