import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    // ❌ user trying to access admin route
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/home" replace />;
    }

    // ✅ admin allowed
    return <Outlet />;
  } catch (err) {
    console.error("Token error", err);
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
