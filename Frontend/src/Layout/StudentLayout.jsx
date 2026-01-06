import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";

function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="sm:ml-62 p-2 ">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
