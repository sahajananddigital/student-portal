import React from "react";
import { CheckCircle, XCircle, BookOpen, BarChart3 } from "lucide-react";
function StudentPortal() {
  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
  return (
    <>
      <div className="relative h-40 bg-gradient-to-r rounded-2xl  from-[#054676] to-[#1e6bb8] overflow-hidden">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Content Layer */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide text-white">
            Shiksha Skills Institute
          </h1>

          <div className="mt-3 flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs md:text-sm text-white backdrop-blur">
            🎓 Welcome to your student portal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Attendance"
          value="88.5%"
          icon={BarChart3}
          colorClass="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Present Days"
          value="68"
          icon={CheckCircle}
          colorClass="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Absent Days"
          value="4"
          icon={XCircle}
          colorClass="bg-rose-100 text-rose-600"
        />
        <StatCard
          title="Total Courses"
          value="4"
          icon={BookOpen}
          colorClass="bg-amber-100 text-amber-600"
        />
      </div>
    </>
  );
}

export default StudentPortal;
