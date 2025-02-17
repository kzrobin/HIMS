import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext } from "../context/UserContext";
import { Footer } from "../components/Footer";
import { Package } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser, backendUrl } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
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

    if (formData.firstname.length < 2) {
      validationErrors.firstname = "First name must be at least 2 characters.";
      isValid = false;
    }

    if (formData.lastname.length < 3) {
      validationErrors.lastname = "Last name must be at least 3 characters.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newUser = {
        fullname: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        `${backendUrl}/users/register`,
        newUser,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setUser(response.data.user);
        navigate("/dashboard");
        toast.success(
          "Account created successfully! Please verify your account."
        );
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      if (error.response?.status === 409) {
        setErrors({ email: "Email already exists" });
      } else if (error.response?.status === 500) {
        toast.error("Internal Server error. Please try again later.");
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

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <button className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm sm:text-base">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={submitHandler}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-sm border border-gray-200"
        >
          <h2 className="text-3xl font-semibold text-[#1C542A] text-center mb-6">
            Create an Account
          </h2>

          {/* First Name and Last Name */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-100">
                <input
                  name="firstname"
                  type="text"
                  required
                  value={formData.firstname}
                  onChange={handleForm}
                  placeholder="First name"
                  className="bg-transparent outline-none text-gray-800 flex-1"
                />
              </div>
              {errors.firstname && (
                <span className="text-red-500 text-sm">{errors.firstname}</span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-100">
                <input
                  name="lastname"
                  type="text"
                  required
                  value={formData.lastname}
                  onChange={handleForm}
                  placeholder="Last name"
                  className="bg-transparent outline-none text-gray-800 flex-1"
                />
              </div>
              {errors.lastname && (
                <span className="text-red-500 text-sm">{errors.lastname}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-100">
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
            <div className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-100">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleForm}
                placeholder="Password"
                className="bg-transparent outline-none text-gray-800 flex-1"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#3BCD5B] to-[#2E8B57] text-white font-medium hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#3BCD5B] transition-all"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#3BCD5B] hover:text-[#2E8B57] transition-colors"
            >
              Login here
            </Link>
          </p>
        </form>
      </main>

      {/* Footer */}
      <footer className="mt-6">
        <Footer show={false} />
      </footer>
    </div>
  );
};

export default Signup;
