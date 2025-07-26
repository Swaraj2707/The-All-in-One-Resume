import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/form.css";
import "./styles/profile.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LocalizationProvider dateAdapter={AdapterDayjs}>
  <BrowserRouter>
  <App />
  </BrowserRouter>
  
</LocalizationProvider>);
