import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Calendar,
  ArrowRight,
  RotateCcw,
  Filter,
} from "lucide-react";

const Task = () => {
  const BACKEND = import.meta.env.VITE_LOCAL_BACKEND_PORT;

  const [view, setView] = useState("board");
  const [tasks, setTasks] = useState([]);

  // Changed: Initialize as empty array instead of hardcoded data
  const [students, setStudents] = useState([]);

  const [user, setUser] = useState({ id: null, role: "user", name: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [studentFilter, setStudentFilter] = useState("");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch students immediately so they are available for the Board and Create views
    fetchStudents(token);

    if (token) {
      const decoded = parseJwt(token);
      const userId = decoded.sub || decoded.id;

      if (userId) {
        setUser({
          id: userId,
          role: decoded.role || "user",
          name: decoded.name || decoded.email || "User",
        });

        fetchTasks(userId, token);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchStudents = async (token) => {
    try {
      const response = await fetch(`${BACKEND}?action=get-dropdown-students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStudents(data.students || data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchTasks = async (userId, token) => {
    try {
      const response = await fetch(`${BACKEND}?action=get-tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const sanitizedTasks = data.tasks.map((task) => ({
          ...task,
          status: task.status || "To Do",
          assignedTo: Number(task.assignedTo),
        }));
        setTasks(sanitizedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo) return;

    const taskPayload = {
      ...newTask,
      assignedTo: parseInt(newTask.assignedTo),
      status: "To Do",
      createdBy: user.id,
    };

    try {
      const response = await fetch(`${BACKEND}?action=create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTasks((prev) => [data.task, ...prev]);
        setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
        setView("board");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  const deleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id.toString() === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (user.role === "admin" && studentFilter) {
      return task.assignedTo === parseInt(studentFilter);
    }
    return true;
  });

  const renderCreateTask = () => (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setView("board")}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Create Assignment
          </h2>
          <p className="text-slate-500">Assign a new task to a student.</p>
        </div>
      </div>

      <form
        onSubmit={handleCreateTask}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Task Title
          </label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Algebra Chapter 5 Exercises"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
            placeholder="Add detailed instructions..."
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Assign To Student
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
            >
              <option value="">Select a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.grade ? `(${s.grade})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setView("board")}
            className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#054676] text-white hover:bg-[#054676]/80 flex items-center gap-2 shadow-lg"
          >
            <PlusCircle size={18} />
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );

  const renderKanbanBoard = () => {
    const todoTasks = filteredTasks.filter((t) => t.status === "To Do");
    const pendingTasks = filteredTasks.filter((t) => t.status === "Pending");
    const successTasks = filteredTasks.filter((t) => t.status === "Success");

    const TaskCard = ({ task }) => {
      // Find student in the dynamically fetched array
      const student = students.find((s) => s.id == task.assignedTo);

      return (
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          className="group bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 mb-3 relative cursor-move active:cursor-grabbing"
        >
          <div className="flex justify-between items-start mb-2">
            {user.role === "admin" && (
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <h4 className="font-bold text-slate-800 mb-1">{task.title}</h4>
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
            <div className="flex items-center gap-2">
              {student ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                    {/* Fallback if avatar prop is missing in API data */}
                    {student.avatar || student.name.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-600 font-medium truncate max-w-[80px]">
                    {student.name.split(" ")[0]}
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Unassigned
                </span>
              )}
            </div>

            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar size={12} />
                {new Date(task.due_date || task.dueDate).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="flex h-[calc(100vh-140px)] gap-6 overflow-x-auto pb-4 pt-2">
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "To Do")}
          className="flex-1 min-w-[300px] bg-slate-100/50 rounded-xl p-4 flex flex-col transition-colors hover:bg-slate-100/80"
        >
          <h3 className="font-bold text-slate-700 mb-4 px-1">
            To Do{" "}
            <span className="ml-2 bg-slate-200 text-xs px-2 py-0.5 rounded-full">
              {todoTasks.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-2 space-y-1 min-h-[100px]">
            {todoTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "Pending")}
          className="flex-1 min-w-[300px] bg-blue-50/50 rounded-xl p-4 flex flex-col transition-colors hover:bg-blue-50/80"
        >
          <h3 className="font-bold text-slate-700 mb-4 px-1">
            Pending{" "}
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {pendingTasks.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-2 space-y-1 min-h-[100px]">
            {pendingTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "Success")}
          className="flex-1 min-w-[300px] bg-emerald-50/50 rounded-xl p-4 flex flex-col transition-colors hover:bg-emerald-50/80"
        >
          <h3 className="font-bold text-slate-700 mb-4 px-1">
            Success{" "}
            <span className="ml-2 bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full">
              {successTasks.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-2 space-y-1 min-h-[100px]">
            {successTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        Loading...
      </div>
    );

  return (
    <div className="bg-white shadow-2xl rounded-2xl font-sans flex flex-col">
      {view === "board" && (
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">Task Board</h1>
            {user.role === "admin" && (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Filter size={14} className="text-slate-500" />
                <select
                  className="bg-transparent text-sm text-slate-600 outline-none cursor-pointer"
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                >
                  <option value="">All Students</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {user.role === "admin" ? (
            <button
              onClick={() => setView("create")}
              className="bg-[#054676] hover:bg-[#054676]/80 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <PlusCircle size={18} />
              <span>Create Task</span>
            </button>
          ) : (
            <div className="text-sm text-slate-500 italic">
              Logged in as {user.name}
            </div>
          )}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 overflow-hidden">
        {view === "board" ? renderKanbanBoard() : renderCreateTask()}
      </main>
    </div>
  );
};

export default Task;
