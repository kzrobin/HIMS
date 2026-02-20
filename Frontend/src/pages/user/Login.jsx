import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Package } from "lucide-react";
import { motion } from "framer-motion";
import { UserDataContext } from "../../context/UserContext";
import { Footer } from "../../components/common/Footer";

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
      const response = await axios.post(`${backendUrl}/users/login`, formData, {
        withCredentials: true,
      });

      console.log("res", response);

      if (response.status === 200) {
        setUser(response.data.user);
        const redirectTo =
          new URLSearchParams(location.search).get("next") || "/dashboard";
        toast.success("Logged in successfully!");
        navigate(redirectTo);
      }
    } catch (error) {
      if (!error.response) {
        // Network error (no response from backend)
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
              general:
                "Invalid request. Please check your input and try again.",
            }));
            break;
          case 401:
            setErrors((prev) => ({
              ...prev,
              password: "Incorrect email or password.",
            }));
            break;
          case 403:
            setErrors((prev) => ({
              ...prev,
              general:
                "Account not verified. Please check your email for verification.",
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
          <Link to="/signup">
            <button className="px-4 py-2 bg-[#8B7E66] text-white rounded-lg hover:bg-[#6B6651] transition-all text-sm sm:text-base">
              Sign Up
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
            Welcome Back
          </h2>
          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {errors.general}
            </div>
          )}
          <form onSubmit={submitHandler}>
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
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <Link
                to="/reset-password"
                className="text-[#588157] hover:text-[#344E41] text-sm transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Signup Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              New to HomeHaven?{" "}
              <Link
                to="/signup"
                className="text-[#588157] hover:text-[#344E41] transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </form>
        </motion.div>
      </main>

      <Footer show={false} />
    </div>
  );
};

export default Login;
