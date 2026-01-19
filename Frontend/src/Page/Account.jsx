import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Edit2,
  BookOpen,
  Award,
  School,
  Clock,
  FileText,
  Save,
  X,
} from "lucide-react";
import avatar from "../assets/Admin/avatar.jpg";
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
    <div className="p-2 bg-indigo-50 text-[#054676] rounded-lg">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
  </div>
);

const InfoRow = ({ label, value, icon: Icon, isEditing, onChange }) => (
  <div
    className={`flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl transition-all duration-200 group ${isEditing ? "ring-2 ring-indigo-50 border-indigo-200 shadow-sm" : "hover:bg-slate-50"}`}
  >
    <div className="flex items-center gap-4 flex-1">
      {Icon && (
        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-white group-hover:text-[#054676] group-hover:shadow-md transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        {isEditing ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        ) : (
          <p className="text-sm font-bold text-slate-900 break-all">
            {value || "—"}
          </p>
        )}
      </div>
    </div>
    {!isEditing && (
      <div className="p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit2 className="w-4 h-4" />
      </div>
    )}
  </div>
);

const StatCard = ({
  label,
  value,
  icon: Icon,
  colorClass = "bg-blue-500",
  isEditing,
  onChange,
}) => (
  <div
    className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all ${isEditing ? "ring-2 ring-indigo-50 border-indigo-200" : "hover:shadow-md"}`}
  >
    <div className="flex items-start justify-between mb-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      {Icon && <Icon className="w-4 h-4 text-slate-300" />}
    </div>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`}></div>
      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-sm font-bold text-slate-900 truncate" title={value}>
          {value || "Not Available"}
        </p>
      )}
    </div>
  </div>
);

export default function Account() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const BACKEND_PORT = import.meta.env.VITE_LOCAL_BACKEND_PORT;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !BACKEND_PORT) return;

    fetch(`${BACKEND_PORT}?action=student-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfile(data);
          setFormData({ student: data.student });
        }
      })
      .catch((err) => console.log("Fetch error:", err));
  }, [BACKEND_PORT]);

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ student: profile.student });
    } else {
      setFormData({ student: profile.student });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.student.name,
        middlename: formData.student.middlename,
        surname: formData.student.surname,
        phone: formData.student.phone,
        birthdate: formData.student.dob,

        // Guardian Info
        parentphone: formData.student.parent_phone,
        parentemail: formData.student.parent_email,
        parentaddressproof: formData.student.parentaddressproof,

        // Academic Info
        enrolmentnumber: formData.student.enrolmentnumber,
        education: formData.student.education,
        collegename: formData.student.college,
        startdate: formData.student.start_date,
        enddate: formData.student.end_date,
      };

      const res = await fetch(`${BACKEND_PORT}?action=update-students`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Profile Updated Successfully");
        setIsEditing(false);
        // Optional: Refresh profile data here to sync any backend formatting
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
      alert("Server error");
    }
  };

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getData = (section, field) => {
    return isEditing
      ? formData?.[section]?.[field]
      : profile?.[section]?.[field];
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="relative h-64 w-full bg-[#054676] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8 relative">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 z-20">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 font-medium transition-all"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-[#054676] text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg font-medium transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#054676] rounded-xl shadow-sm border border-slate-200 hover:bg-indigo-50 font-medium transition-all"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                <img
                  src={avatar}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left pb-2 w-full pr-0 sm:pr-32">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                  <input
                    type="text"
                    value={formData.student.name || ""}
                    onChange={(e) =>
                      updateField("student", "name", e.target.value)
                    }
                    placeholder="First Name"
                    className="text-lg font-bold bg-slate-50 border-b-2 border-indigo-200 focus:border-[#054676] outline-none px-1 py-1"
                  />

                  <input
                    type="text"
                    value={formData.student.middlename || ""}
                    onChange={(e) =>
                      updateField("student", "middlename", e.target.value)
                    }
                    placeholder="Middle Name"
                    className="text-lg font-bold bg-slate-50 border-b-2 border-indigo-200 focus:border-[#054676] outline-none px-1 py-1"
                  />

                  <input
                    type="text"
                    value={formData.student.surname || ""}
                    onChange={(e) =>
                      updateField("student", "surname", e.target.value)
                    }
                    placeholder="Surname"
                    className="text-lg font-bold bg-slate-50 border-b-2 border-indigo-200 focus:border-[#054676] outline-none px-1 py-1"
                  />
                </div>
              ) : (
                <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                  {[
                    profile?.student?.name,
                    profile?.student?.middlename,
                    profile?.student?.surname,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </h1>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#054676] text-xs font-bold uppercase tracking-wide border border-indigo-100">
                  <Award className="w-3.5 h-3.5" />
                  {isEditing ? (
                    <input
                      className="bg-transparent w-24 outline-none border-b border-indigo-300"
                      value={formData.student.student_id}
                      onChange={(e) =>
                        updateField("student", "student_id", e.target.value)
                      }
                    />
                  ) : (
                    profile?.student?.student_id
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  {isEditing ? (
                    <input
                      className="bg-transparent w-32 outline-none border-b border-slate-300 focus:border-indigo-500"
                      value={formData.student.major}
                      onChange={(e) =>
                        updateField("student", "major", e.target.value)
                      }
                    />
                  ) : (
                    profile?.student?.major
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Personal Information */}
            <section>
              <SectionHeader title="Personal Information" icon={User} />
              <div className="space-y-3">
                <InfoRow
                  label="Email Address"
                  value={getData("user", "email")}
                  icon={Mail}
                  isEditing={isEditing}
                  onChange={(val) => updateField("user", "email", val)}
                />
                <InfoRow
                  label="Phone Number"
                  value={getData("student", "phone")}
                  icon={Phone}
                  isEditing={isEditing}
                  onChange={(val) => updateField("student", "phone", val)}
                />
                <InfoRow
                  label="Date of Birth"
                  value={getData("student", "dob")}
                  icon={Calendar}
                  isEditing={isEditing}
                  onChange={(val) => updateField("student", "dob", val)}
                />
              </div>
            </section>

            {/* Parent / Guardian Info */}
            <section>
              <SectionHeader title="Guardian Contact" icon={ShieldCheck} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatCard
                  label="Parent Phone"
                  value={getData("student", "parent_phone")}
                  icon={Phone}
                  colorClass="bg-emerald-500"
                  isEditing={isEditing}
                  onChange={(val) =>
                    updateField("student", "parent_phone", val)
                  }
                />
                <StatCard
                  label="Parent Email"
                  value={getData("student", "parent_email")}
                  icon={Mail}
                  colorClass="bg-blue-500"
                  isEditing={isEditing}
                  onChange={(val) =>
                    updateField("student", "parent_email", val)
                  }
                />
                <div className="sm:col-span-2">
                  <StatCard
                    label="Address Proof"
                    value={getData("student", "parentaddressproof")}
                    icon={FileText}
                    colorClass="bg-purple-500"
                    isEditing={isEditing}
                    onChange={(val) =>
                      updateField("student", "parentaddressproof", val)
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Academic Profile */}
            <section>
              <SectionHeader title="Academic Details" icon={BookOpen} />
              <div className="space-y-3">
                <InfoRow
                  label="Enrollment Number"
                  value={getData("student", "enrolmentnumber")}
                  icon={Award}
                  isEditing={isEditing}
                  onChange={(val) =>
                    updateField("student", "enrolmentnumber", val)
                  }
                />
                <InfoRow
                  label="Education Level"
                  value={getData("student", "education")}
                  icon={GraduationCap}
                  isEditing={isEditing}
                  onChange={(val) => updateField("student", "education", val)}
                />
                <InfoRow
                  label="College / Institute"
                  value={getData("student", "college")}
                  icon={School}
                  isEditing={isEditing}
                  onChange={(val) => updateField("student", "college", val)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow
                    label="Start Date"
                    value={getData("student", "start_date")}
                    icon={Clock}
                    isEditing={isEditing}
                    onChange={(val) =>
                      updateField("student", "start_date", val)
                    }
                  />
                  <InfoRow
                    label="End Date"
                    value={getData("student", "end_date")}
                    icon={Calendar}
                    isEditing={isEditing}
                    onChange={(val) => updateField("student", "end_date", val)}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
