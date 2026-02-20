import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext } from "../../context/UserContext";

const Logout = () => {
  const { backendUrl, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(
          `${backendUrl}/users/logout`,
          {},
          { withCredentials: true },
        );

        // Clear local storage/session data
        localStorage.removeItem("token"); // If using token-based auth
        sessionStorage.clear();

        // Reset user context
        setUser(null);

        toast.success("Logged out successfully!");
        navigate("/login"); // Navigate to login after successful logout
      } catch (error) {
        toast.error("Log out failed. Please try again");
        localStorage.removeItem("token"); // If using token-based auth
        sessionStorage.clear();
        navigate("/login"); // Redirect back to dashboard on failure
      }
    };

    logoutUser();
  }, [backendUrl, navigate, setUser]);

  return <div className="text-center mt-10">Logging Out...</div>;
};

export default Logout;
