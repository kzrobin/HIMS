import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")).render(
  <UserContext>
    <BrowserRouter>
      <ToastContainer
        // position="top-left" // Position the toast on the top-left corner
        autoClose={5000} // Duration for how long the toast will be displayed
        hideProgressBar={false} // Show or hide the progress bar
        newestOnTop={false} // Whether to show newest toast on top
        closeOnClick={true} // Close the toast on click
        rtl={false} // Whether to display right to left
        pauseOnFocusLoss={true} // Pause the toast if the window loses focus
        draggable={false} // Disable the ability to drag the toast
        pauseOnHover={true} // Pause the toast when hovered
        style={{
          top: "90px",
        }} // Additional styling for left alignment
      />
      <App />
    </BrowserRouter>
  </UserContext>
);
