import { useState } from "react";
import Logo from "../assets/imageforlogin.jpg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'; 
import Scroll from "../assets/scroll.png";

export default function LogIn() {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      toast.error("Please select a user type.");
      return;
    }

    const urlMap = {
      Principal: "http://localhost:3000/api/principal/signIn",
      Teacher: "http://localhost:3000/api/teacher/signIn",
      Student: "http://localhost:3000/api/student/signIn",
    };

    const dashboardMap = {
      Principal: "/principalDashboard",
      Teacher: "/teacherDashboard",
      Student: "/studentDashboard",
    };



    try {
      const response = await fetch(urlMap[userType], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success("Login successful!");
        navigate(dashboardMap[userType]);
      } else {
        const data = await response.json();
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
         alt="Logo"
         src={Logo}
         className="mx-auto h-60 mt-16 w-auto shadow-2xl rounded-full border-4 border-indigo-500 p-2"
        />


          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
          {
                userType === "Teacher" ? "Sign In as a Teacher" : userType === "Student" ? "Sign In as a Student" : userType === "Principal" ? "Sign In as a Principal" : "Login to your account"
          }
          </h2>
        </div>

        <div>
          <img src={Scroll} className="mx-auto h-16" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="User"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Select User Type
              </label>
              <div className="mt-2">
                <select
                  id="User"
                  name="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="Principal">Principal</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-md hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              >
                Sign in
              </button>

              {
                (userType === "Teacher" || userType === "Student") && (
                  <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-md hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
                )
              }
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
