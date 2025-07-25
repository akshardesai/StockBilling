import { StrictMode } from "react";

import { createRoot } from "react-dom/client";


import "./index.css";



import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";


import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Stock from "./pages/Stock/Stock.jsx";
import Logs from "./pages/logs/Logs.jsx"
import Layout from "./Layout.jsx"
import Bills from "./pages/bills/Bills.jsx";




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Dashboard />} />
      <Route path="stock" element={<Stock />} />
      <Route path="logs" element={<Logs />} />
      <Route path="bills" element={<Bills/>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
