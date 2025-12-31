import React, { useState } from "react";

function Form() {
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
    parentemail: "",
    parentphone: "",
    parentaddressproof: "",
    agree: false,
  });

  const handlchanges = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };

  const handlvalidate = () => {
    let error = {};
    if (!form.name) {
      error.name = "Name is required";
    }
    if (!form.email) {
      error.email = "Email is required";
    }
    if (!form.phone) {
      error.phone = "Phone is required";
    }
    if (!form.education) {
      error.education = "Education is required";
    }
    if (!form.collegename) {
      error.collegename = "College Name is required";
    }
    if (!form.enrolmentnumber) {
      error.enrolmentnumber = "Enrolment Number is required";
    }
    if (!form.birthdate) {
      error.birthdate = "Birth Date is required";
    }
    if (!form.addressproof) {
      error.addressproof = "Address Proof is required";
    }
    if (!form.resumefile) {
      error.resumefile = "Resume is required";
    }
    if (!form.interestedtechnology) {
      error.interestedtechnology = "Interested Technology is required";
    }
    if (!form.startdate) {
      error.startdate = "Start Date is required";
    }
    if (!form.enddate) {
      error.enddate = "End Date is required";
    }
    if (!form.parentemail) {
      error.parentemail = "Parent Email is required";
    }
    if (!form.parentphone) {
      error.parentphone = "Parent Phone is required";
    }
    if (!form.parentaddressproof) {
      error.parentaddressproof = "Parent Address Proof is required";
    }
    if (!form.agree) {
      error.agree = "Agree is required";
    }
    seterror(error);
    return error;
  };

  const handlsubmit = (e) => {
    e.preventDefault();
    if (Object.keys(handlvalidate()).length > 0) {
      return;
    }
    console.log(form);
  };

  return (
    <>
      <div className="lg:m-5">
        <h1 className="mb-6 text-xl text-center font-semibold lg:text-2xl">
          Register Form{" "}
        </h1>
        <form
          onSubmit={handlsubmit}
          className="relative border border-gray-100 space-y-4 max-w-screen-lg mx-auto rounded-md bg-white p-6 shadow-xl lg:p-10"
        >
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
              {error.name}
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
            </div>
          </div>
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
            </div>
          </div>
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
            </div>
          </div>
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
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block mb-2">Address Proof :</label>

              {/* Hidden file input */}
              <input
                type="file"
                id="addressproof"
                className="hidden"
                value={form.addressproof}
                onChange={handlchanges}
              />

              {/* Custom UI */}
              <label
                htmlFor="resume"
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
                name="resume"
                id="resume"
                className="hidden"
                value={form.resume}
                onChange={handlchanges}
              />

              {/* Custom UI */}
              <label
                htmlFor="resume"
                className="flex items-center justify-center h-12 w-full cursor-pointer rounded-md bg-gray-100 text-gray-500"
              >
                Choose your Latest Resume
              </label>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label>Interested Technology</label>
              <div className="relative w-56 mt-2 rounded-lg">
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="select-1"
                  value={form.technology}
                  onChange={handlchanges}
                />

                <label
                  htmlFor="select-1"
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-3 text-sm text-gray-700 ring-blue-400 peer-checked:ring"
                >
                  Select Option
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

                <ul
                  value={form.technology}
                  onChange={handlchanges}
                  className="
        absolute z-10 w-full
        max-h-0 overflow-hidden
        rounded-lg bg-white shadow-md
        transition-all duration-300
        peer-checked:max-h-52
        peer-checked:overflow-y-auto
      "
                >
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
                      className="cursor-pointer px-3 py-2 text-sm text-gray-600 hover:bg-blue-500 hover:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>{" "}
            <div>
              <label className="block mb-1">Start Date</label>
              <div className="relative w-56">
                <input
                  type="date"
                  name="startdate"
                  value={form.startdate}
                  onChange={handlchanges}
                  className="h-12 w-full rounded-md bg-gray-100 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">End Date</label>

              <div className="relative w-56">
                <input
                  type="date"
                  name="enddate"
                  value={form.enddate}
                  onChange={handlchanges}
                  className="h-12 w-full rounded-md bg-gray-100 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
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
              </div>
              <div>
                <label htmlFor="">Parent Email</label>
                <input
                  type="text"
                  name="parentemail"
                  value={form.parentemail}
                  onChange={handlchanges}
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
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              id="chekcbox1"
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
