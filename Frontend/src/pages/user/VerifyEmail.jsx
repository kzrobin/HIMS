import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";
import Layout from "../../components/layout/Layout";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { backendUrl, user, getUser } = useContext(UserDataContext);
  const inputRefs = useRef([]);
  const [getOTP, setGeOTP] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Handle OTP input
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Submit OTP
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      const response = await axios.post(
        `${backendUrl}/users/verify/`,
        {
          otp: String(otp),
        },
        { withCredentials: true },
      );

      if (response.status == 200) {
        toast.success(response.data.message);
        getUser();
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Resend OTP
  const sendOTP = async () => {
    try {
      
      setIsResendDisabled(true);
      setCountdown(30); // Reset countdown

      const response = await axios.post(
        `${backendUrl}/users/verify/send-otp`,
        {
          email: user?.email,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status == 200) {
        toast.success("OTP send successfully!");
        setGeOTP(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to OTP");
    }
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (isResendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isResendDisabled]);

  // Redirect if already verified
  useEffect(() => {
    if (user.isAccountVerified) {
      toast("User is already verified");
      navigate("/dashboard");
    }
  }, []);

  return (
    <Layout>
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-sm border border-gray-200 mx-auto my-32 sm:my-16"
      >
        <h1 className="text-3xl font-semibold text-[#1C542A] text-center mb-4">
          Verify Your Email
        </h1>
        <p className="text-center mb-6 text-gray-600">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                required
                className="w-12 h-12 bg-gray-100 text-gray-800 text-center text-xl rounded-lg border border-gray-200 focus:outline-none focus:border-[#3BCD5B]"
              />
            ))}
        </div>

        {/* Verify Button */}

        {!getOTP && (
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#3BCD5B] to-[#2E8B57] text-white font-medium hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#3BCD5B] transition-all mb-4"
          >
            Verify Email
          </button>
        )}

        {/* Resend OTP Button */}
        <button
          type="button"
          onClick={sendOTP}
          disabled={isResendDisabled}
          className="w-full py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getOTP
            ? "Send OTP"
            : isResendDisabled
              ? `Resend OTP in ${countdown}s`
              : "Resend OTP"}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
        >
          Cancel
        </button>
      </form>
    </Layout>
  );
};

export default VerifyEmail;
