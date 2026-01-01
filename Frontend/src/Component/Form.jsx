import React, { useRef, useState } from "react";

function Form() {
  const dropdownRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const [error, seterror] = useState({});
  const [form, setform] = useState({
    name: "",
    middlename: "",
    surname: "",
    addressproof: "",
    email: "",
    phone: "",
    education: "",
    collegename: "",
    enrolmentnumber: "",
    birthdate: "",
    resumefile: "",
    interestedtechnology: "",
    startdate: "",
    enddate: "",
    parentphone: "",
    parentaddressproof: "",
    agree: false,
  });

  const handlchanges = (e) => {
    const { name, type, value, checked } = e.target;

    setform((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      seterror((prev) => ({
        ...prev,
        [name]: "File must be less than 5 MB",
      }));

      e.target.value = "";
      setform((prev) => ({ ...prev, [name]: null }));
      return;
    }

    seterror((prev) => ({ ...prev, [name]: "" }));
    setform((prev) => ({ ...prev, [name]: file }));
  };

  const handleTechnologySelect = (value) => {
    setform((prev) => ({
      ...prev,
      interestedtechnology: value,
    }));

    seterror((prev) => ({
      ...prev,
      interestedtechnology: "",
    }));
    if (dropdownRef.current) {
      dropdownRef.current.checked = false;
    }
  };

  const handlvalidate = () => {
    let error = {};

    if (!form.name.trim()) {
      error.name = "Name is required";
    } else if (form.name.trim().length < 3) {
      error.name = "Name must be at least 3 characters long";
    }

    if (!form.middlename.trim()) {
      error.middlename = "Middle Name is required";
    } else if (form.middlename.trim().length < 3) {
      error.middlename = "Middle Name must be at least 3 characters long";
    }

    if (!form.surname.trim()) {
      error.surname = "Surname is required";
    } else if (form.surname.trim().length < 3) {
      error.surname = "Surname must be at least 3 characters long";
    }

    if (!form.email.trim()) {
      error.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      error.email = "Email is not valid";
    }

    if (!form.phone.trim()) {
      error.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      error.phone = "Phone must be 10 digits";
    }

    if (!form.education.trim()) {
      error.education = "Education is required";
    } else if (form.education.trim().length < 3) {
      error.education = "Education must be at least 3 characters long";
    }

    if (!form.collegename.trim()) {
      error.collegename = "College Name is required";
    } else if (form.collegename.trim().length < 3) {
      error.collegename = "College Name must be at least 3 characters long";
    }

    if (!form.enrolmentnumber.trim()) {
      error.enrolmentnumber = "Enrolment Number is required";
    } else if (form.enrolmentnumber.trim().length < 3) {
      error.enrolmentnumber =
        "Enrolment Number must be at least 3 characters long";
    }

    if (!form.birthdate.trim()) {
      error.birthdate = "Birth Date is required";
    } else if (!/\d{4}-\d{2}-\d{2}/.test(form.birthdate)) {
      error.birthdate = "Birth Date is not valid";
    }

    if (!form.addressproof) {
      error.addressproof = "Address Proof is required";
    } else if (form.addressproof.size > MAX_FILE_SIZE) {
      error.addressproof = "Address Proof must be less than 5 MB";
    }

    if (!form.resumefile) {
      error.resumefile = "Resume is required";
    } else if (form.resumefile.size > MAX_FILE_SIZE) {
      error.resumefile = "Resume must be less than 5 MB";
    }

    if (!form.interestedtechnology.trim()) {
      error.interestedtechnology = "Interested Technology is required";
    }

    if (!form.startdate.trim()) {
      error.startdate = "Start Date is required";
    }

    if (!form.enddate.trim()) {
      error.enddate = "End Date is required";
    }

    if (!form.parentphone.trim()) {
      error.parentphone = "Parent Phone is required";
    } else if (!/^\d{10}$/.test(form.parentphone)) {
      error.parentphone = "Parent Phone must be 10 digits";
    }

    if (!form.parentaddressproof.trim()) {
      error.parentaddressproof = "Address  is required";
    } else if (form.parentaddressproof.length < 3) {
      error.parentaddressproof = "Address  must be at least 3 characters long";
    }
    if (!form.agree) {
      error.agree = "You must agree to the terms and conditions";
    }

    seterror(error);
    return error;
  };
  const handlsubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(handlvalidate()).length > 0) return;

    try {
      const formData = new FormData();

      // Append all text/number/date/checkbox fields
      Object.keys(form).forEach((key) => {
        if (key !== "resumefile" && key !== "addressproof") {
          formData.append(key, form[key]);
        }
      });

      // Append files
      if (form.resumefile) {
        formData.append("resumefile", form.resumefile);
      }
      if (form.addressproof) {
        formData.append("addressproof", form.addressproof);
      }

      const res = await fetch(
        "http://localhost:8080/student-portal/Backend/upload.php",
        {
          method: "POST",
          body: formData, // ✅ Do NOT set Content-Type manually
        }
      );

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log("Request failed", error);
    }
  };

  return (
    <>
      <div className="lg:m-5">
        <h1 className="mb-6 text-xl text-center font-semibold lg:text-2xl">
          Register Form{" "}
        </h1>
        <form
          method="post"
          onSubmit={handlsubmit}
          className="relative border border-gray-100 space-y-4 max-w-screen-lg mx-auto rounded-md bg-white p-6 shadow-xl lg:p-10"
        >
          {/* FirstName, LastName, MiddleName  */}
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className=""> First Name </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handlchanges}
                placeholder="Your Name"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.name}</span>}
            </div>
            <div>
              <label className=""> Middle Name </label>
              <input
                type="text"
                name="middlename"
                value={form.middlename}
                onChange={handlchanges}
                placeholder="Middle Name"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.middlename}</span>}
            </div>
            <div>
              <label className=""> Last Name </label>
              <input
                type="text"
                name="surname"
                value={form.surname}
                onChange={handlchanges}
                placeholder="Last  Name"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.surname}</span>}
            </div>
          </div>
          {/* Email, Phone */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className=""> Email Address : </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handlchanges}
                placeholder="Enter Email Address"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.email}</span>}
            </div>
            <div>
              <label className=""> Phone:</label>
              <input
                type="number"
                name="phone"
                value={form.phone}
                onChange={handlchanges}
                placeholder="Enter WhatsApp Number"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.phone}</span>}
            </div>
          </div>
          {/* Education */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className=""> Education: </label>
              <input
                type="text"
                name="education"
                value={form.education}
                onChange={handlchanges}
                placeholder="Enter Education"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.education}</span>}
            </div>

            <div>
              <label className=""> College Name ( Full Name ) : </label>
              <input
                type="text"
                name="collegename"
                value={form.collegename}
                onChange={handlchanges}
                placeholder="Enter College Name"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.collegename}</span>}
            </div>
          </div>
          {/* Enrolment Number */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className=""> Enrolment Number : </label>
              <input
                type="text"
                name="enrolmentnumber"
                value={form.enrolmentnumber}
                onChange={handlchanges}
                placeholder="Enter Enrolment Number"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.enrolmentnumber}</span>}
            </div>{" "}
            <div>
              <label className=""> Birth Date: </label>
              <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handlchanges}
                placeholder="Enter Enrolment Number"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
              {<span className="text-red-500"> {error.birthdate}</span>}
            </div>
          </div>
          {/* Address Proof */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block mb-2">Address Proof :</label>

              {/* Hidden file input */}
              <input
                type="file"
                name="addressproof"
                id="addressproof"
                className="hidden"
                onChange={handleFileChange}
              />
              {<span className="text-red-500"> {error.addressproof}</span>}
              {/* Custom UI */}
              <label
                htmlFor="addressproof"
                className="flex items-center justify-center h-12 w-full cursor-pointer rounded-md bg-gray-100 text-gray-500"
              >
                Choose your Address Proof
              </label>
            </div>

            <div>
              <label className="block mb-2">Latest Resume :</label>

              {/* Hidden file input */}
              <input
                type="file"
                name="resumefile"
                id="resumefile"
                className="hidden"
                onChange={handleFileChange}
              />
              {<span className="text-red-500"> {error.resumefile}</span>}
              {/* Custom UI */}
              <label
                htmlFor="resumefile"
                className="flex items-center justify-center h-12 w-full cursor-pointer rounded-md bg-gray-100 text-gray-500"
              >
                Choose your Latest Resume
              </label>
            </div>
          </div>
          {/* Interested Technology */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label>Interested Technology</label>
              <div className="relative w-72 mt-2 rounded-lg">
                <input
                  type="checkbox"
                  className="peer hidden"
                  id="select-technology"
                  ref={dropdownRef}
                />
                <label
                  htmlFor="select-technology"
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-3 text-sm text-gray-700 ring-blue-400 peer-checked:ring"
                >
                  {form.interestedtechnology || "Select Technology"}
                </label>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="pointer-events-none absolute right-4 top-4 h-4 text-gray-600 transition-transform peer-checked:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>

                <ul className="absolute z-10 w-full max-h-0 overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 peer-checked:max-h-52 peer-checked:overflow-y-auto">
                  {[
                    "WordPress",
                    "Web Development",
                    "Python",
                    "Frappe",
                    "UI / UX Design",
                    "AI / ML",
                    "Data Science",
                    "Mobile App Development",
                  ].map((item) => (
                    <li
                      key={item}
                      onClick={() => handleTechnologySelect(item)}
                      className="cursor-pointer px-3 py-2 text-sm text-gray-600 hover:bg-blue-500 hover:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {
                  <span className="text-red-500">
                    {" "}
                    {error.interestedtechnology}
                  </span>
                }
              </div>
            </div>
            <div>
              <label className="block mb-1">Start Date</label>
              <div className="relative w-72">
                <input
                  type="date"
                  name="startdate"
                  value={form.startdate}
                  onChange={handlchanges}
                  className="h-12 w-full rounded-md bg-gray-100 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {<span className="text-red-500"> {error.startdate}</span>}
              </div>
            </div>
            <div>
              <label className="block mb-1">End Date</label>

              <div className="relative w-72">
                <input
                  type="date"
                  name="enddate"
                  value={form.enddate}
                  onChange={handlchanges}
                  className="h-12 w-full rounded-md bg-gray-100 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {<span className="text-red-500"> {error.enddate}</span>}
              </div>
            </div>
          </div>
          {/* Optional Section Linkdin Link */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className=""> Linkedin Link ( Optional ): </label>
              <input
                type="text"
                placeholder="Enter Linkedin Link"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
            </div>

            <div>
              <label className="">
                {" "}
                StackOverflow Profile Link ( Optional ) :{" "}
              </label>
              <input
                type="text"
                placeholder="Enter StackOverflow Profile Link"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
            </div>
          </div>{" "}
          {/* Optional Section Github Link */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className=""> Github Profile Link: </label>
              <input
                type="text"
                placeholder="Enter Github Profile Link"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
            </div>

            <div>
              <label className="">
                Mention Other Social Media ( For Updates )
              </label>
              <input
                type="text"
                placeholder="Enter Other Social Media"
                className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
              />
            </div>
          </div>
          {/* Parent Contact Details */}
          <div>
            <hr className="my-6" />
            <div>
              <h1 className="mb-6 text-xl text-center font-semibold lg:text-2xl">
                Parent Contact Details :{" "}
              </h1>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                {" "}
                <label htmlFor="">Parent Contact Number</label>
                <input
                  type="number"
                  name="parentphone"
                  value={form.parentphone}
                  onChange={handlchanges}
                  placeholder="Enter Parent Contact Number"
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                />
                {<span className="text-red-500"> {error.parentphone}</span>}
              </div>
              <div>
                <label htmlFor="">Parent Email</label>
                <input
                  type="text"
                  placeholder="Enter Parent Email"
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                />
              </div>
            </div>

            <label htmlFor=""> Address</label>
            <textarea
              name="parentaddressproof"
              id=""
              value={form.parentaddressproof}
              onChange={handlchanges}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            ></textarea>
            {<span className="text-red-500"> {error.parentaddressproof}</span>}
          </div>
          {/* Checkbox */}
          <div className="checkbox">
            <input
              type="checkbox"
              id="chekcbox1"
              name="agree"
              checked={form.agree}
              onChange={handlchanges}
            />
            <label htmlFor="chekcbox1">
              I agree to the{" "}
              <a href="#" target="_blank" className="text-blue-600">
                {" "}
                Terms and Conditions{" "}
              </a>{" "}
            </label>
          </div>
          {<span className="text-red-500"> {error.agree}</span>}
          {/* Button */}
          <div>
            <button
              type="submit"
              className="mt-5 w-full rounded-md bg-[#064675] p-2 text-center font-semibold text-white"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Form;
