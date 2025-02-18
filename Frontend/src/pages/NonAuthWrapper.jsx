import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const NonAuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const location = useLocation();

  // Determine the redirect path
  const reDirectTo =
    location.state?.from !== "/logout" ? location.state?.from : "/dashboard";

  if (user) {
    navigate(reDirectTo || "/dashboard", { replace: true });
    return null;
  }

  return <>{children}</>;
};

export default NonAuthWrapper;
