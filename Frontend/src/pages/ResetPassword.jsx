import React, { useContext, useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { Package } from "lucide-react";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: "",
    general: "",
  });

  const inputRefs = useRef([]);

  // OTP Input Handlers
  const handleInput = (e, index) => {
    if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    inputRefs.current[paste.length - 1]?.focus();
  };

  // Email Submission
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ email: "", general: "" });

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter your email address.",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/users/reset-password/send-otp`,
        { email }
      );
      if (response.status === 200) {
        setOriginalEmail(email);
        setIsEmailSent(true);
        setIsTimerActive(true);
        setTimer(30);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "We couldn’t send the OTP. Please check your connection or try again.";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Submission
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ otp: "", general: "" });

    const otpValue = inputRefs.current.map((input) => input.value).join("");
    if (otpValue.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otp: "Please enter all 6 digits of the OTP.",
      }));
      setIsSubmitting(false);
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
    setIsSubmitting(false);
  };

  // New Password Submission
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ password: "", general: "" });

    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "Please enter a new password.",
      }));
      setIsSubmitting(false);
      return;
    }
    if (newPassword.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Your password must be at least 6 characters long.",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(`${backendUrl}/users/reset-password`, {
        email: originalEmail,
        otp,
        newPassword,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "We couldn’t reset your password. Please try again or request a new OTP.";
      setErrors((prev) => ({ ...prev, general: message }));
      setIsOtpSubmitted(false); // Allow retry
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsSubmitting(true);
    setErrors({ general: "" });
    try {
      const response = await axios.post(
        `${backendUrl}/users/reset-password/send-otp`,
        {
          email: originalEmail,
        }
      );
      if (response.status === 200) {
        setIsTimerActive(true);
        setTimer(30);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general:
          "We couldn’t resend the OTP. Please check your connection or try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Change Email
  const handleChangeEmail = () => {
    if (email === originalEmail) {
      handleResendOTP();
    } else {
      setIsEmailSent(false);
      setIsOtpSubmitted(false);
      setOtp("");
      setNewPassword("");
      setTimer(30);
      setIsTimerActive(false);
      setErrors({ email: "", otp: "", password: "", general: "" });
    }
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF5]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#A3B18A] to-[#588157] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 sm:h-10 sm:w-10" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              HomeHaven
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <button className="px-4 py-2 bg-[#8B7E66] text-white rounded-lg hover:bg-[#6B6651] transition-all text-sm sm:text-base">
                Login
              </button>
            </Link>
            <Link to="/signup" className="hidden sm:block">
              <button className="px-4 py-2 bg-[#8B7E66] text-white rounded-lg hover:bg-[#6B6651] transition-all text-sm sm:text-base">
                Sign Up
              </button>
            </Link>
          </div>
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
          {/* Email Form */}
          {!isEmailSent && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#344E41] text-center mb-6">
                Reset Your Password
              </h2>
              {errors.general && (
                <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                  {errors.general}
                </div>
              )}
              <form onSubmit={onSubmitEmail}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                        general: "",
                      }));
                    }}
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#588157] hover:bg-[#344E41]"
                  }`}
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {/* OTP Form */}
          {!isOtpSubmitted && isEmailSent && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#344E41] text-center mb-6">
                Verify OTP
              </h2>
              {errors.general && (
                <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                  {errors.general}
                </div>
              )}
              <form onSubmit={onSubmitOTP}>
                <p className="text-center text-sm mb-6 text-gray-600">
                  Enter the 6-digit code sent to {originalEmail}.
                </p>
                <div
                  className="flex justify-between mb-6"
                  onPaste={handlePaste}
                >
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onInput={(e) => {
                          handleInput(e, index);
                          setErrors((prev) => ({
                            ...prev,
                            otp: "",
                            general: "",
                          }));
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 bg-gray-100 text-gray-800 text-center text-xl rounded-lg border border-gray-300 focus:border-[#588157] focus:ring-2 focus:ring-[#588157] outline-none transition-all"
                        disabled={isSubmitting}
                      />
                    ))}
                </div>
                {errors.otp && (
                  <span className="text-red-500 text-xs mb-4 block text-center">
                    {errors.otp}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#588157] hover:bg-[#344E41]"
                  }`}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="mt-4 text-center text-sm">
                  {isTimerActive ? (
                    <p className="text-gray-600">
                      Resend OTP in{" "}
                      <span className="font-semibold">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-[#588157] hover:text-[#344E41] transition-colors"
                      disabled={isSubmitting}
                    >
                      Resend OTP
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="block mt-2 text-[#588157] hover:text-[#344E41] transition-colors"
                    disabled={isSubmitting}
                  >
                    Change Email
                  </button>
                </div>
              </form>
            </>
          )}

          {/* New Password Form */}
          {isOtpSubmitted && isEmailSent && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#344E41] text-center mb-6">
                Set New Password
              </h2>
              {errors.general && (
                <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                  {errors.general}
                </div>
              )}
              <form onSubmit={onSubmitNewPassword}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                        general: "",
                      }));
                    }}
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#588157] hover:bg-[#344E41]"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </main>

      <Footer show={false} />
    </div>
  );
};

export default ResetPassword;
