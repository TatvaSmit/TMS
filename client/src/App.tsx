import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./utils/routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AlertNotification from "./components/AlertNotification";

const App = () => {
  return (
    <Provider store={store}>
      <AlertNotification />
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
