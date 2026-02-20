import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext } from "../../context/UserContext";
import { Footer } from "../../components/common/Footer";
import { Package } from "lucide-react";
import { motion } from "framer-motion";

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
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForm = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear field-specific errors on input change
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
      general: "",
    }));
  };

  // Form validation function
  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;

    if (!formData.firstname || formData.firstname.length < 2) {
      validationErrors.firstname = "First name must be at least 2 characters.";
      isValid = false;
    }

    if (!formData.lastname || formData.lastname.length < 2) {
      validationErrors.lastname = "Last name must be at least 2 characters.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      validationErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      validationErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
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
        {
          withCredentials: true,
        },
      );

      if (response.status === 201) {
        setUser(response.data.user);
        toast.success(
          "Account created successfully! Please check your email to verify.",
        );
        const redirectTo = response.data.redirect || "/dashboard"; // Assuming redirect from backend
        navigate(redirectTo);
      }
    } catch (error) {
      // console.error("Signup Error:", error.response?.data || error.message);
      if (!error.response) {
        setErrors((prev) => ({
          ...prev,
          general:
            "Unable to connect to the server. Please check your internet or try again later.",
        }));
      } else {
        switch (error.response?.status) {
          case 400:
            setErrors((prev) => ({
              ...prev,
              general: "Invalid input data. Please check your details.",
            }));
            break;
          case 409:
            setErrors((prev) => ({
              ...prev,
              email: "This email is already registered.",
            }));
            break;
          case 500:
            setErrors((prev) => ({
              ...prev,
              general:
                "Server error. Please try again later or contact support.",
            }));
            toast.error("Internal server error.");
            break;
          default:
            setErrors((prev) => ({
              ...prev,
              general: "An unexpected error occurred. Please try again.",
            }));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF5]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#A3B18A] to-[#588157] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to={"/"} className="flex items-center space-x-3">
            <Package className="h-8 w-8 sm:h-10 sm:w-10" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              HomeHaven
            </h1>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 bg-[#8B7E66] text-white rounded-lg hover:bg-[#6B6651] transition-all text-sm sm:text-base">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#344E41] text-center mb-6">
            Get Started with HomeHaven
          </h2>
          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {errors.general}
            </div>
          )}
          <form onSubmit={submitHandler}>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleForm}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-[#588157] focus:ring-2 focus:ring-[#588157] outline-none text-gray-800 transition-all"
                  disabled={isSubmitting}
                />
                {errors.firstname && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.firstname}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleForm}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-[#588157] focus:ring-2 focus:ring-[#588157] outline-none text-gray-800 transition-all"
                  disabled={isSubmitting}
                />
                {errors.lastname && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.lastname}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleForm}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-[#588157] focus:ring-2 focus:ring-[#588157] outline-none text-gray-800 transition-all"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleForm}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-[#588157] focus:ring-2 focus:ring-[#588157] outline-none text-gray-800 transition-all"
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#588157] hover:bg-[#344E41]"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#588157] hover:text-[#344E41] transition-colors"
              >
                Log in here
              </Link>
            </p>
          </form>
        </motion.div>
      </main>

      <Footer show={false} />
    </div>
  );
};

export default Signup;
