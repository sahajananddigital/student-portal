import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Camera,
  LogOut,
  Edit2,
  BookOpen,
  Award,
} from "lucide-react";

// Detailed Student Mock Data
const STUDENT_DATA = {
  personal: {
    fullName: "Alex Rivera",
    studentId: "STU-2024-0891",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 012-3456",
    dob: "March 15, 2002",
    gender: "Non-binary",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  academic: {
    major: "Computer Science & Engineering",
    minor: "Mathematics",
    semester: "4th Semester",
    advisor: "Dr. Sarah Smith",
    gpa: "3.85",
    campus: "North Campus - Building A",
  },
  status: {
    enrollment: "Full-Time",
    joiningDate: "August 2022",
    graduationYear: "2026",
    accountStatus: "Active",
  },
};

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 px-1 mb-4">
    <Icon className="w-5 h-5 text-[#054676]" />
    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
      {title}
    </h3>
  </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-xl group">
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
      <Edit2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default function Account() {
  return (
    <div className=" bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Top Banner & Profile Header */}
      <div className="relative h-48 bg-gradient-to-r rounded-2xl from-[#054676] to-[#1e6bb8] ">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute -bottom-16 left-0 w-full px-6">
          <div className="max-w-2xl mx-auto flex items-end gap-6 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
            <div className="relative group">
              <img
                src={STUDENT_DATA.personal.avatar}
                className="w-24 h-24 rounded-2xl border-4 border-white bg-indigo-50 shadow-sm"
                alt="Profile"
              />
              <button className="absolute -bottom-2 -right-2 p-2 bg-[#054676] text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="pb-2 flex-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {STUDENT_DATA.personal.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-sm font-bold text-[#054676] bg-indigo-50 px-2 py-0.5 rounded-md">
                  {STUDENT_DATA.personal.studentId}
                </span>
                <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {STUDENT_DATA.academic.major}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-2xl mx-auto px-6 mt-24 space-y-8">
        {/* Personal Information */}
        <section>
          <SectionHeader title="Personal Information" icon={User} />
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            <InfoRow
              label="Email Address"
              value={STUDENT_DATA.personal.email}
              icon={Mail}
            />
            <InfoRow
              label="Phone Number"
              value={STUDENT_DATA.personal.phone}
              icon={Phone}
            />
            <InfoRow
              label="Date of Birth"
              value={STUDENT_DATA.personal.dob}
              icon={Calendar}
            />
            <InfoRow
              label="Gender"
              value={STUDENT_DATA.personal.gender}
              icon={User}
            />
          </div>
        </section>

        {/* Academic Profile */}
        <section>
          <SectionHeader title="Academic Profile" icon={BookOpen} />
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            <InfoRow
              label="Current Semester"
              value={STUDENT_DATA.academic.semester}
              icon={Award}
            />
            <InfoRow
              label="Academic Advisor"
              value={STUDENT_DATA.academic.advisor}
              icon={User}
            />
            <InfoRow
              label="Current GPA"
              value={STUDENT_DATA.academic.gpa}
              icon={ShieldCheck}
            />
            <InfoRow
              label="Primary Campus"
              value={STUDENT_DATA.academic.campus}
              icon={MapPin}
            />
          </div>
        </section>

        {/* Student Status */}
        <section>
          <SectionHeader title="Student Status" icon={ShieldCheck} />
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
            <div className="p-5">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Enrollment
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <p className="text-sm font-bold text-slate-800">
                  {STUDENT_DATA.status.enrollment}
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Graduation Year
              </p>
              <p className="text-sm font-bold text-slate-800">
                Class of {STUDENT_DATA.status.graduationYear}
              </p>
            </div>
            <div className="p-5 border-t border-slate-50">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Member Since
              </p>
              <p className="text-sm font-bold text-slate-800">
                {STUDENT_DATA.status.joiningDate}
              </p>
            </div>
            <div className="p-5 border-t border-slate-50">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Account Security
              </p>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                Verified Student
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
