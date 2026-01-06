import React, { useState } from "react";
import dashboard from "../assets/Admin/dashboard.svg";
import attendance from "../assets/Admin/attend.svg";
import task from "../assets/Admin/task.svg";
import certificate from "../assets/Admin/certificate.svg";
import offerLetter from "../assets/Admin/offerletter.svg";
import setting from "../assets/Admin/setting.svg";
import signout from "../assets/Admin/signout.svg";
import { Link } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-[#054676] text-white
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* Top Menu */}
          <div className="space-y-2">
            <SidebarItem
              title="Dashboard"
              icon={dashboard}
              to="/student-portal"
            />
            <SidebarItem
              title="Attendance"
              icon={attendance}
              to="/attendance"
            />
            <SidebarItem title="Task" icon={task} to="/task" />
            <SidebarItem
              title="Certificate"
              icon={certificate}
              to="/certificate"
            />
            <SidebarItem
              title="Offer Letter"
              icon={offerLetter}
              to="/offer-letter"
            />
          </div>

          {/* Push bottom */}
          <div className="mt-auto space-y-3 pt-4 border-t border-white/20">
            {/* Profile */}
            <SidebarItem title="Account Setting" icon={setting} to="/account" />

            {/* Sign Out */}
            <SidebarItem title="Sign Out" danger icon={signout} />
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ title, danger, icon, to }) {
  return (
    <Link
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition
      ${
        danger
          ? "text-red-400 hover:bg-red-500/20"
          : "text-white hover:bg-white/10"
      }`}
      to={to}
    >
      <img src={icon} alt={title} className="w-5 h-5" />
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
}

export default Sidebar;
