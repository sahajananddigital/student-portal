import React, { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle, BookOpen, ArrowLeft } from "lucide-react";

// Mock course data
const COURSES = [
  { id: 1, name: "Advanced Web Development", code: "CS402", room: "Lab 404" },
  { id: 2, name: "Database Systems", code: "CS305", room: "Hall A" },
  { id: 3, name: "Machine Learning", code: "CS408", room: "Room 202" },
];

export default function Attendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("idle"); // 'idle', 'checked-in', 'finished'
  const [log, setLog] = useState({
    checkIn: null,
    checkOut: null,
    checkInRaw: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    setLog({
      ...log,
      checkIn: now.toLocaleTimeString(),
      checkInRaw: now, // Store raw date for duration calculation later
    });
    setAttendanceStatus("checked-in");
  };

  const handleCheckOut = async () => {
    setIsSubmitting(true);
    const now = new Date();
    const checkOutTimeStr = now.toLocaleTimeString();

    // Calculate duration in minutes
    const durationMs = now - log.checkInRaw;
    const durationMinutes = Math.floor(durationMs / 60000);

    // Prepare data for API
    const payload = {
      studentId: "STUDENT_ID_HERE", // Replace with actual student context
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      courseCode: selectedCourse.code,
      startTime: log.checkIn,
      endTime: checkOutTimeStr,
      durationMinutes: durationMinutes,
    };

    try {
      // REPLACE WITH YOUR ACTUAL API ENDPOINT
      const response = await fetch(
        "https://api.example.com/attendance/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setLog((prev) => ({ ...prev, checkOut: checkOutTimeStr }));
        setAttendanceStatus("finished");
      } else {
        alert("Failed to submit attendance. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSession = () => {
    setSelectedCourse(null);
    setAttendanceStatus("idle");
    setLog({ checkIn: null, checkOut: null, checkInRaw: null });
  };

  return (
    <div className="font-sans text-slate-900 p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Clock Section */}
        <div className="relative rounded-2xl h-40 bg-gradient-to-r from-[#054676] to-[#1e6bb8] overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-widest mb-2">
              Current Session
            </p>
            <h2 className="text-4xl font-mono font-bold text-white mb-1">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </h2>

            <p className="text-indigo-100 text-sm">
              {currentTime.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Step 1: Select Subject */}
        {!selectedCourse && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#054676] " />
              <h3 className="font-bold text-slate-800">Select Subject</h3>
            </div>
            <div className="p-2">
              {COURSES.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="w-full flex items-center justify-between p-4 hover:bg-indigo-50 rounded-xl transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-800 group-hover:text-[#054676]">
                      {course.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {course.code} • {course.room}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-[#054676] group-hover:text-white">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 & 3: Check-in / Check-out */}
        {selectedCourse && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Back Button (Only if not checked in) */}
              {attendanceStatus === "idle" && (
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#054676] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Subject
                </button>
              )}

              {/* Class Info Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-[#054676] text-white rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Active Subject
                  </p>
                  <h4 className="font-bold text-slate-800 leading-tight">
                    {selectedCourse.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedCourse.code} • {selectedCourse.room}
                  </p>
                </div>
              </div>

              {/* Interaction Logic */}
              <div className="pt-2">
                {attendanceStatus === "idle" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium justify-center">
                      <MapPin className="w-4 h-4" />
                      <span>Verified: Within Campus Range</span>
                    </div>
                    <button
                      onClick={handleCheckIn}
                      className="w-full bg-[#054676] hover:bg-[#054676] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      Mark Attendance
                    </button>
                  </div>
                )}

                {attendanceStatus === "checked-in" && (
                  <div className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Session In Progress
                    </div>
                    <p className="text-sm text-slate-500">
                      Checked in at{" "}
                      <span className="font-bold text-slate-800">
                        {log.checkIn}
                      </span>
                    </p>
                    <button
                      onClick={handleCheckOut}
                      disabled={isSubmitting}
                      className={`w-full ${
                        isSubmitting
                          ? "bg-slate-400"
                          : "bg-rose-500 hover:bg-rose-600"
                      } text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-100 active:scale-95`}
                    >
                      {isSubmitting ? "Syncing..." : "End Attendance"}
                    </button>
                  </div>
                )}

                {attendanceStatus === "finished" && (
                  <div className="space-y-6 py-4 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Session Completed
                      </h3>
                      <div className="mt-4 space-y-1 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p>
                          Check-in:{" "}
                          <span className="font-semibold text-slate-700">
                            {log.checkIn}
                          </span>
                        </p>
                        <p>
                          Check-out:{" "}
                          <span className="font-semibold text-slate-700">
                            {log.checkOut}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetSession}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      Close & Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
