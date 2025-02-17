import React, { useContext, useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext } from "../context/UserContext";
import { Package } from "lucide-react";
import { Footer } from "../components/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [timer, setTimer] = useState(30); // Timer for resend OTP
  const [isTimerActive, setIsTimerActive] = useState(false); // To control the timer

  // Handle OTP input
  const inputRefs = useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Handle email submission
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/users/reset-password/send-otp`,
        { email }
      );
      if (response.status === 200) {
        setIsEmailSent(true);
        setIsTimerActive(true); // Start the timer
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Handle OTP submission
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  // Handle new password submission
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${backendUrl}/users/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (response.status == 200) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setIsOtpSubmitted(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/users/reset-password/send-otp`,
        { email }
      );
      if (response.status === 200) {
        setIsTimerActive(true); // Restart the timer
        setTimer(30); // Reset the timer to 30 seconds
        toast.success("OTP resent successfully!");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false); // Stop the timer
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

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

            {/* Signup and Login Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <button className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm sm:text-base">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="hidden sm:block bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm sm:text-base">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 sm:px-0">
        {/* Email Form */}
        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-sm border border-gray-200"
          >
            <h2 className="text-3xl font-semibold text-[#1C542A] text-center mb-3">
              Reset Password
            </h2>
            <p className="text-center text-sm mb-6 text-gray-600">
              Enter your registered email address to receive a reset OTP.
            </p>

            <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 mb-6">
              <img src={assets.mail_icon} alt="Mail Icon" className="w-5 h-5" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                name="email"
                required
                className="bg-transparent outline-none text-gray-800 flex-1"
              />
            </div>
            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#3BCD5B] to-[#2E8B57] text-white font-medium hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#3BCD5B] transition-all">
              Submit
            </button>
          </form>
        )}

        {/* OTP Form */}
        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitOTP}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-sm border border-gray-200"
          >
            <h1 className="text-[#1C542A] text-2xl font-semibold text-center mb-4">
              Enter OTP
            </h1>
            <p className="text-center mb-6 text-gray-600">
              Enter the 6-digit code sent to your email.
            </p>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength={1}
                    key={index}
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    required
                    className="w-12 h-12 bg-gray-100 text-gray-800 text-center text-xl rounded-md border border-gray-200 focus:border-[#3BCD5B] focus:outline-none"
                  />
                ))}
            </div>
            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#3BCD5B] to-[#2E8B57] text-white font-medium hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#3BCD5B] transition-all">
              Submit
            </button>

            {/* Resend OTP and Change Email Options */}
            <div className="mt-4 text-center">
              {isTimerActive ? (
                <p className="text-gray-600">
                  Resend OTP in <span className="font-semibold">{timer}</span>{" "}
                  seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-[#3BCD5B] hover:text-[#2E8B57] transition-colors"
                >
                  Resend OTP
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEmailSent(false)}
                className="block mt-2 text-[#3BCD5B] hover:text-[#2E8B57] transition-colors"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* New Password Form */}
        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-sm border border-gray-200"
          >
            <h2 className="text-3xl font-semibold text-[#1C542A] text-center mb-3">
              New Password
            </h2>
            <p className="text-center text-sm mb-6 text-gray-600">
              Enter your new password below.
            </p>

            <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 mb-6">
              <img src={assets.lock_icon} alt="Lock Icon" className="w-5 h-5" />
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password"
                placeholder="New Password"
                name="newPassword"
                required
                className="bg-transparent outline-none text-gray-800 flex-1"
              />
            </div>
            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#3BCD5B] to-[#2E8B57] text-white font-medium hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#3BCD5B] transition-all">
              Submit
            </button>
          </form>
        )}
      </main>
      <Footer show={false} />
    </div>
  );
};

export default ResetPassword;
