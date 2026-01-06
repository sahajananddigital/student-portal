import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  ShieldCheck,
  FileText,
  Globe,
  Linkedin,
  Github,
  ChevronDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function RegisterForm() {
  const brandColor = "#054676";
  const dropdownRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Use empty string as fallback for env variable per environment instructions
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

  // Form State
  const [form, setForm] = useState({
    name: "",
    middlename: "",
    surname: "",
    email: "",
    phone: "",
    education: "",
    collegename: "",
    enrolmentnumber: "",
    birthdate: "",
    addressproof: null,
    resumefile: null,
    interestedtechnology: "",
    fees: "",
    startdate: "",
    enddate: "",
    linkedin: "",
    github: "",
    othersocial: "",
    parentphone: "",
    parentemail: "",
    parentaddressproof: "", // Mapping to the textarea in your snippet
    agree: false,
  });

  // UI & Logic States
  const [error, setError] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear specific error when typing
    if (error[name]) setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError((prev) => ({
        ...prev,
        [name]: "File must be less than 5 MB",
      }));
      e.target.value = "";
      setForm((prev) => ({ ...prev, [name]: null }));
      return;
    }

    setError((prev) => ({ ...prev, [name]: "" }));
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const handleTechnologySelect = (tech) => {
    setForm((prev) => ({ ...prev, interestedtechnology: tech }));
    setError((prev) => ({ ...prev, interestedtechnology: "" }));
    if (dropdownRef.current) dropdownRef.current.checked = false;
  };

  const validate = () => {
    let errs = {};

    if (!form.name.trim()) {
      errs.name = "Name is required";
    } else if (form.name.trim().length < 3) {
      errs.name = "Name must be at least 3 characters long";
    }

    if (!form.middlename.trim()) {
      errs.middlename = "Middle Name is required";
    } else if (form.middlename.trim().length < 3) {
      errs.middlename = "Middle Name must be at least 3 characters long";
    }

    if (!form.surname.trim()) {
      errs.surname = "Surname is required";
    } else if (form.surname.trim().length < 3) {
      errs.surname = "Surname must be at least 3 characters long";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Email is not valid";
    }

    if (!form.phone.trim()) {
      errs.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      errs.phone = "Phone must be 10 digits";
    }

    if (!form.education.trim()) {
      errs.education = "Education is required";
    } else if (form.education.trim().length < 3) {
      errs.education = "Education must be at least 3 characters long";
    }

    if (!form.collegename.trim()) {
      errs.collegename = "College Name is required";
    } else if (form.collegename.trim().length < 3) {
      errs.collegename = "College Name must be at least 3 characters long";
    }

    if (!form.enrolmentnumber.trim()) {
      errs.enrolmentnumber = "Enrolment Number is required";
    } else if (form.enrolmentnumber.trim().length < 3) {
      errs.enrolmentnumber =
        "Enrolment Number must be at least 3 characters long";
    }

    if (!form.birthdate.trim()) {
      errs.birthdate = "Birth Date is required";
    }

    if (!form.addressproof) {
      errs.addressproof = "Address Proof is required";
    }

    if (!form.resumefile) {
      errs.resumefile = "Resume is required";
    }

    if (!form.interestedtechnology.trim()) {
      errs.interestedtechnology = "Interested Technology is required";
    }

    if (!form.startdate.trim()) {
      errs.startdate = "Start Date is required";
    }

    if (!form.enddate.trim()) {
      errs.enddate = "End Date is required";
    }

    if (!form.fees.trim()) {
      errs.fees = "Fees is required";
    }

    if (!form.parentphone.trim()) {
      errs.parentphone = "Parent Phone is required";
    } else if (!/^\d{10}$/.test(form.parentphone)) {
      errs.parentphone = "Parent Phone must be 10 digits";
    }

    if (!form.parentaddressproof.trim()) {
      errs.parentaddressproof = "Address is required";
    } else if (form.parentaddressproof.length < 3) {
      errs.parentaddressproof = "Address must be at least 3 characters long";
    }

    if (!form.agree) {
      errs.agree = "You must agree to the terms and conditions";
    }

    setError(errs);
    return errs;
  };

  const submitToBackend = async (paymentId) => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      // Handle file or primitive value
      formData.append(key, form[key]);
    });
    formData.append("razorpay_payment_id", paymentId);

    const res = await fetch(
      "http://localhost:8080/student-portal/Backend/index.php",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Backend submission failed");
    }
    return await res.text();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPaying) return;

    setIsPaying(true);
    setErrorMsg("");
    setSuccessMsg("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setIsPaying(false);
      setErrorMsg("Please correct the errors in the form.");
      return;
    }

    const feesAmount = parseInt(form.fees);
    if (!feesAmount || feesAmount <= 0) {
      setIsPaying(false);
      setErrorMsg("Enter valid fees");
      return;
    }

    // Razorpay Integration
    const options = {
      key: RAZORPAY_KEY,
      amount: feesAmount * 100, // in paise
      currency: "INR",
      name: "Attendify Training",
      description: `Fees for ${form.interestedtechnology}`,
      handler: async function (response) {
        try {
          if (!response.razorpay_payment_id) {
            setErrorMsg("Payment failed. Please try again.");
            setIsPaying(false);
            return;
          }

          await submitToBackend(response.razorpay_payment_id);

          setPaymentSuccess(true);
          setSuccessMsg("🎉 Payment successful! Your form has been submitted.");

          // Reset form
          setForm({
            name: "",
            middlename: "",
            surname: "",
            email: "",
            phone: "",
            education: "",
            collegename: "",
            enrolmentnumber: "",
            birthdate: "",
            addressproof: null,
            resumefile: null,
            interestedtechnology: "",
            fees: "",
            startdate: "",
            enddate: "",
            linkedin: "",
            github: "",
            othersocial: "",
            parentphone: "",
            parentemail: "",
            parentaddressproof: "",
            agree: false,
          });
          setIsPaying(false);
        } catch (err) {
          console.error(err);
          setErrorMsg("Something went wrong while saving data");
          setIsPaying(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsPaying(false);
        },
      },
      theme: { color: brandColor },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setErrorMsg("Razorpay SDK not loaded. Please refresh.");
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl mb-4 text-white"
            style={{ backgroundColor: brandColor }}
          >
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Register with Attendify
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            Empowering your academic journey
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
        >
          <div className="p-8 lg:p-10 space-y-8">
            {/* Section 1: Personal Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChanges}
                    placeholder="First Name"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm font-medium"
                  />
                  {error.name && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.name}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middlename"
                    value={form.middlename}
                    onChange={handleChanges}
                    placeholder="Middle Name"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.middlename && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.middlename}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={form.surname}
                    onChange={handleChanges}
                    placeholder="Last Name"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.surname && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.surname}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChanges}
                    placeholder="Email Address"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.email && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.email}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChanges}
                    placeholder="10-digit number"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.phone && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Academic Details */}
            <hr className="border-slate-100" />
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={form.education}
                    onChange={handleChanges}
                    placeholder="Enter Education"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.education && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.education}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    name="collegename"
                    value={form.collegename}
                    onChange={handleChanges}
                    placeholder="Enter Full College Name"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.collegename && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.collegename}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Enrollment No.
                  </label>
                  <input
                    type="text"
                    name="enrolmentnumber"
                    value={form.enrolmentnumber}
                    onChange={handleChanges}
                    placeholder="Enter Enrollment Number"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.enrolmentnumber && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.enrolmentnumber}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChanges}
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium text-slate-500"
                  />
                  {error.birthdate && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.birthdate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: File Uploads */}
            <hr className="border-slate-100" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Address Proof
                </label>
                <input
                  type="file"
                  name="addressproof"
                  id="addressproof"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="addressproof"
                  className="flex flex-col items-center justify-center h-32 w-full cursor-pointer rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider text-center px-4">
                    {form.addressproof
                      ? form.addressproof.name
                      : "Choose Address Proof"}
                  </span>
                </label>
                {error.addressproof && (
                  <span className="text-rose-500 text-[10px] font-bold mt-1 block text-center">
                    {error.addressproof}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Latest Resume
                </label>
                <input
                  type="file"
                  name="resumefile"
                  id="resumefile"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="resumefile"
                  className="flex flex-col items-center justify-center h-32 w-full cursor-pointer rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <FileText className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider text-center px-4">
                    {form.resumefile
                      ? form.resumefile.name
                      : "Choose Latest Resume"}
                  </span>
                </label>
                {error.resumefile && (
                  <span className="text-rose-500 text-[10px] font-bold mt-1 block text-center">
                    {error.resumefile}
                  </span>
                )}
              </div>
            </div>

            {/* Section 4: Technology & Course */}
            <hr className="border-slate-100" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                  Interested Tech
                </label>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="tech-toggle"
                    ref={dropdownRef}
                    className="peer hidden"
                  />
                  <label
                    htmlFor="tech-toggle"
                    className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {form.interestedtechnology || "Select Tech"}
                    <ChevronDown className="w-4 h-4 text-slate-400 peer-checked:rotate-180 transition-transform" />
                  </label>
                  <ul className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden max-h-0 peer-checked:max-h-60 transition-all duration-300 overflow-y-auto invisible peer-checked:visible">
                    {[
                      "WordPress",
                      "Web Development",
                      "Python",
                      "Frappe",
                      "UI / UX Design",
                      "AI / ML",
                      "Data Science",
                      "Mobile App Development",
                    ].map((tech) => (
                      <li
                        key={tech}
                        onClick={() => handleTechnologySelect(tech)}
                        className="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-medium"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {error.interestedtechnology && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 block">
                      {error.interestedtechnology}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                  Fees
                </label>
                <input
                  type="number"
                  name="fees"
                  value={form.fees}
                  onChange={handleChanges}
                  placeholder="₹ Amount"
                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                />
                {error.fees && (
                  <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                    {error.fees}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Start
                  </label>
                  <input
                    type="date"
                    name="startdate"
                    value={form.startdate}
                    onChange={handleChanges}
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-2 focus:bg-white outline-none text-xs font-medium text-slate-500"
                  />
                  {error.startdate && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.startdate}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    End
                  </label>
                  <input
                    type="date"
                    name="enddate"
                    value={form.enddate}
                    onChange={handleChanges}
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-2 focus:bg-white outline-none text-xs font-medium text-slate-500"
                  />
                  {error.enddate && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.enddate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 5: Professional Links */}
            <hr className="border-slate-100" />
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Professional Profile (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn URL"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="github"
                    placeholder="GitHub URL"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="othersocial"
                    placeholder="Other Portfolio"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Parent Details */}
            <hr className="border-slate-100" />
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Guardian Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Parent Phone
                  </label>
                  <input
                    type="number"
                    name="parentphone"
                    value={form.parentphone}
                    onChange={handleChanges}
                    placeholder="Parent Contact Number"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                  {error.parentphone && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.parentphone}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    name="parentemail"
                    value={form.parentemail}
                    onChange={handleChanges}
                    placeholder="Enter Parent Email"
                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 focus:bg-white outline-none text-sm font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                    Address
                  </label>
                  <textarea
                    name="parentaddressproof"
                    rows="2"
                    value={form.parentaddressproof}
                    onChange={handleChanges}
                    placeholder="Enter full permanent address"
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:bg-white outline-none resize-none"
                  ></textarea>
                  {error.parentaddressproof && (
                    <span className="text-rose-500 text-[10px] font-bold mt-1 ml-1">
                      {error.parentaddressproof}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Agreement & Submission */}
            <div className="pt-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChanges}
                  className="w-5 h-5 rounded-lg border-slate-200 transition-all cursor-pointer mt-0.5"
                  style={{ accentColor: brandColor }}
                />
                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
                  I agree to the{" "}
                  <a
                    href="#"
                    target="_blank"
                    className="font-bold underline"
                    style={{ color: brandColor }}
                  >
                    Terms and Conditions
                  </a>
                  .
                </span>
              </label>
              {error.agree && (
                <p className="text-rose-500 text-[10px] font-bold mt-2 ml-8">
                  {error.agree}
                </p>
              )}

              <button
                type="submit"
                disabled={isPaying}
                className="w-full mt-8 py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                style={{
                  backgroundColor: brandColor,
                  boxShadow: `0 20px 25px -5px ${brandColor}30`,
                }}
              >
                {isPaying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <>
                    Get Started <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Status Messages */}
              {successMsg && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5" /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" /> {errorMsg}
                </div>
              )}
            </div>
          </div>
        </form>

        <p className="text-center mt-10 text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Secured Enrollment Portal • © 2024 Attendify
        </p>
      </div>
    </div>
  );
}
