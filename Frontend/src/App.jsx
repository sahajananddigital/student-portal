import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentPortal from "./Page/StudentPortal";
import StudentLayout from "./Layout/StudentLayout";
import Attendance from "./Page/Attendance";
import Task from "./Page/Task";
import Certificate from "./Page/Certificate";
import OfferLetter from "./Page/offerLetter";
import Account from "./Page/Account";
import SignIn from "./Page/Signin";
import Verify from "./Page/Verify";
import RegisterForm from "./Component/RegisterForm";
import ProtectedRoute from "./Routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<SignIn />} />
        <Route path="/signup" element={<RegisterForm />} />

        {/* Student Panel */}
        <Route element={<StudentLayout />}>
          <Route index path="/home" element={<StudentPortal />} />
          <Route index path="/attendance" element={<Attendance />} />
          <Route index path="/task" element={<Task />} />
          <Route index path="/certificate" element={<Certificate />} />
          <Route index path="/account" element={<Account />} />
          <Route index path="/verify" element={<Verify />} />

          {/* Admin Panel */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/offer-letter" element={<OfferLetter />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
