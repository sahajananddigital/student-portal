import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./Component/Form";
import StudentPortal from "./Page/StudentPortal";
import StudentLayout from "./Layout/StudentLayout";
import Attendance from "./Page/Attendance";
import Task from "./Page/Task";
import Certificate from "./Page/Certificate";
import OfferLetter from "./Page/offerLetter";
import Account from "./Page/Account";
import SignIn from "./Page/Signin";
import RegisterForm from "./Component/RegisterForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<SignIn />} />
        <Route path="/signup" element={<Form />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />

        <Route element={<StudentLayout />}>
          <Route index path="/student-portal" element={<StudentPortal />} />
          <Route index path="/attendance" element={<Attendance />} />
          <Route index path="/task" element={<Task />} />
          <Route index path="/certificate" element={<Certificate />} />
          <Route index path="/offer-letter" element={<OfferLetter />} />
          <Route index path="/account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
