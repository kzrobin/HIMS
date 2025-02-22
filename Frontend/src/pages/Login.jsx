import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext } from "../context/UserContext";
import { Footer } from "../components/Footer";
import { Package } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, backendUrl } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleForm = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Form validation function
  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // if (formData.password.length < 6) {
    //   validationErrors.password = "Password must be at least 6 characters.";
    //   isValid = false;
    // }

    setErrors(validationErrors);
    return isValid;
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${backendUrl}/users/login`, formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(response.data.user);
        const redirectTo = location.state?.from || "/dashboard";
        return navigate(redirectTo);
      }
    } catch (error) {
      if (!error.response) {
        // No response from backend (network error)
        setErrors((prev) => ({
          ...prev,
          general: "Unable to connect to backend. Please try again later.",
        }));
      } else if (error.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          password: "Invalid email or password",
        }));
      } else if (error.response?.status === 500) {
        toast.error("Internal server error. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#3BCD5B] via-[#2E8B57] to-[#3BCD5B] text-white py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <Package className="h-10 w-10 text-white" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Home Inventory
              </h1>
            </div>

            {/* Signup Button */}
            <div className="flex items-center space-x-4">
              <Link to="/signup">
                <button className="bg-gradient-to-r from-[#9333EA] to-[#4F46E5] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm sm:text-base">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 sm:px-0">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-sm border border-gray-200"
        >
          <h2 className="text-3xl font-semibold text-[#1C542A] text-center mb-3">
            Login to Your Account
          </h2>
          {errors.general && (
            <div className="mb-4 text-center text-red-500 text-sm">
              {errors.general}
            </div>
          )}
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleForm}
                placeholder="email@example.com"
                className="bg-transparent outline-none text-gray-800 flex-1"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleForm}
                placeholder="Enter your password"
                className="bg-transparent outline-none text-gray-800 flex-1"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#3BCD5B] to-[#2E8B57] text-white font-medium hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#3BCD5B] transition-all"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-[#3BCD5B] hover:text-[#2E8B57] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Signup Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#3BCD5B] hover:text-[#2E8B57] transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </main>

      {/* Footer */}
      <Footer show={false} />
    </div>
  );
};

export default Login;
