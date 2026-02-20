import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, backendUrl } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/users/profile`);

        if (response.status === 200 && isMounted) {
          setUser(response.data.user);
        } else if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [backendUrl, setUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }



  // Redirect logic for protected routes
  if (!user) {
    navigate("/login", {
      replace: true,
      state: { from: location.pathname }, // Store original request path
    });

    return null;
  }

  // If the user is logged in, render the children
  return <>{children}</>;
};

export default UserProtectedWrapper;
