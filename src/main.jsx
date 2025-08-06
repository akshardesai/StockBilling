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
// import Logs from "./pages/logs/Logs.jsx"


import Layout from "./Layout.jsx"
import Bills from "./pages/bills/Bills.jsx";

import AuthProvider from "./context/AuthProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "./pages/login/Login.jsx";
import Logs from "./pages/log/Logs.jsx";






const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={

      <ProtectedRoute>

      <Layout />
      </ProtectedRoute>
      
      }>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="stock" element={<Stock />} />
      <Route path="logs" element={<Logs />} />
      <Route path="bills" element={<Bills/>} />
     
    </Route>

    <Route path="/login" element={<Login />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>

      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
