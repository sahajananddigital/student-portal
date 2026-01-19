import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  LogOut,
  Loader2,
  Clock,
  History,
  TrendingUp,
  Award,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Attendance = () => {
  const THEME_COLOR = "#054676";
  const API_BASE_URL = import.meta.env.VITE_LOCAL_BACKEND_PORT;

  const [attendanceStatus, setAttendanceStatus] = useState("idle");
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 4;

  const totalDaysPresent = history.length;

  const totalSeconds = history.reduce(
    (acc, curr) => acc + curr.rawDurationSeconds,
    0,
  );
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const formattedTotalTime = `${totalHours}h ${totalMinutes}m`;

  const averageHours =
    totalDaysPresent > 0 ? (totalHours / totalDaysPresent).toFixed(1) : 0;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (attendanceStatus === "active" && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);
        const hrs = Math.floor(diff / 3600)
          .toString()
          .padStart(2, "0");
        const mins = Math.floor((diff % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const secs = (diff % 60).toString().padStart(2, "0");
        setElapsedTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [attendanceStatus, startTime]);

  const fetchAttendanceHistory = async (page = 1) => {
    setHistoryLoading(true);

    try {
      const student = JSON.parse(localStorage.getItem("student") || "{}");
      const studentId = student.id || 1;

      const response = await fetch(
        `${API_BASE_URL}?action=get-attendance&studentId=${studentId}&page=${page}&limit=${recordsPerPage}`,
      );

      const data = await response.json();

      if (data.status === "success") {
        setHistory(data.data);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalRecords(data.pagination.totalRecords);
      }
    } catch (err) {
      console.error("Attendance fetch failed", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory(1);
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchAttendanceHistory(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchAttendanceHistory(currentPage + 1);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCheckIn = () => {
    setStartTime(new Date());
    setAttendanceStatus("active");
  };

  const handleCheckOut = async () => {
    setLoading(true);

    try {
      const endTime = new Date();
      const studentData = JSON.parse(localStorage.getItem("student") || "{}");
      const studentId = studentData.id || 1;

      const response = await fetch(
        `${API_BASE_URL}?action=student-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentId,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
            date: startTime.toISOString().split("T")[0],
          }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        await fetchAttendanceHistory(1);
        setCurrentPage(1);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        console.error("Failed to save attendance:", data.error);
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setAttendanceStatus("idle");
      setLoading(false);
      setElapsedTime("00:00:00");
      setStartTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans text-slate-800">
      <div className="w-full max-w-6xl bg-white rounded-2xl  shadow-xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row min-h-[600px]">
        <div className="flex-1 flex flex-col relative border-r border-slate-100">
          <div
            className="h-2 w-full absolute top-0 left-0"
            style={{ backgroundColor: THEME_COLOR }}
          ></div>
          <div className="p-8 pb-0">
            <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">
              {getGreeting()}
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Mark Attendance
            </h1>
            <div className="mt-6 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Today's Date
                </p>
                <p className="text-lg font-bold text-slate-700">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="ml-auto font-mono font-bold text-xl text-slate-800">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {attendanceStatus === "idle" ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <button
                  onClick={handleCheckIn}
                  className="group relative w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 hover:shadow-blue-900/20"
                  style={{ backgroundColor: THEME_COLOR }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                  <MapPin className="w-12 h-12 text-white mb-3" />
                  <span className="text-white font-bold text-2xl tracking-wide">
                    CHECK IN
                  </span>
                  <span className="text-blue-200 text-sm mt-1 font-medium">
                    Start Day
                  </span>
                </button>
                <p className="mt-8 text-slate-400 font-medium">
                  Tap above to start your shift
                </p>
              </div>
            ) : (
              <div className="w-full max-w-sm flex flex-col items-center animate-in zoom-in duration-300">
                <div className="mb-10 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-bold uppercase tracking-wide border border-green-100 mb-6 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active Session
                  </div>
                  <div className="text-6xl font-mono font-bold text-slate-900 tracking-tight">
                    {elapsedTime}
                  </div>
                  <p className="text-slate-400 mt-2 font-medium">
                    Started at {formatTime(startTime)}
                  </p>
                </div>

                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                    loading
                      ? "bg-slate-100 cursor-not-allowed"
                      : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                      <span className="text-slate-500 font-bold">
                        Syncing...
                      </span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-6 h-6" />
                      <span className="font-bold text-xl">CHECK OUT</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Success Toast Overlay */}
          {showSuccessToast && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
              <span className="font-medium">
                Attendance Logged Successfully
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 bg-slate-50 p-8 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Days Present */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {totalDaysPresent}
              </p>
              <p className="text-xs font-medium text-slate-400">Days Present</p>
            </div>

            {/* Total Hours */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formattedTotalTime}
              </p>
              <p className="text-xs font-medium text-slate-400">Total Hours</p>
            </div>

            {/* Avg Hours */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {averageHours}
                <span className="text-sm font-medium text-slate-400"> Hrs</span>
              </p>
              <p className="text-xs font-medium text-slate-400">
                Avg. Hours / Day
              </p>
            </div>
          </div>

          {/* Recent History List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                Recent History
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                {totalRecords} Records
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Calendar className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-medium">No attendance records yet</p>
                </div>
              ) : (
                history.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {record.date.split(",")[0].substring(0, 3)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {record.date}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {record.checkIn} - {record.checkOut}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100">
                        {record.duration}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || historyLoading}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1 || historyLoading
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <span className="text-sm font-medium text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || historyLoading}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages || historyLoading
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
