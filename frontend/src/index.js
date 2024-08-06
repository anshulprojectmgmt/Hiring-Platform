import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Provider } from "react-redux";
import store , {persistor} from "./store";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null}  persistor={persistor}>
        <BrowserRouter >
          <App />
        
        </BrowserRouter>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);
