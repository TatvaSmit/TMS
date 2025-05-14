import React, { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { clearAlert, hideAlert } from "../redux/slices/alertSlice";
import { clearAuthState } from "../redux/slices/authSlice";
import { clearBoardState } from "../redux/slices/boardSlice";

const AlertNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector(
    (state: RootState) => state.alert
  );

  useEffect(() => {
    dispatch(clearAlert());
    dispatch(clearAuthState());
    dispatch(clearBoardState());
  }, [dispatch]);

  const handleClose = () => {
    dispatch(hideAlert());
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertNotification;
