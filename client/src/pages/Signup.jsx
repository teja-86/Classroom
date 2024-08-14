import { useState } from "react";
import Logo from "../assets/imageforlogin.jpg";
import { useNavigate } from "react-router-dom";
import Scroll from "../assets/scroll.png";
import toast, { Toaster } from 'react-hot-toast';

function Signup() {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // const [classroomId, setClassroomId] = useState("");
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      toast.error("Please select a user type.");
      return;
    }

    

    const urlMap = {
      Teacher: `${apiBaseUrl}/api/teacher/signUp`,
      Student: `${apiBaseUrl}/api/student/signUp`,
    };



    try {
      const response = await fetch(urlMap[userType], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, password}),
      });

      if (response.ok) {
        toast.success("Signup successful!");
        setUserType("");
        setEmail("");
        setName("");
        setPassword("");
        navigate('/');
      } else {
        const data = await response.json();
        toast.error(data.message || "Signup failed! Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error occurred during signup. Please try again.");
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
                userType === "Teacher" ? "Sign up as a Teacher" : userType === "Student" ? "Sign up as a Student" : "Sign up to your account"
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
                  {/* <option value="Principal">Principal</option> */}
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
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
                  Sign up
                </button>
                
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default Signup