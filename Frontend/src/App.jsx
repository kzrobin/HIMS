import { Routes, Route } from "react-router-dom";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import NonAuthWrapper from "./pages/NonAuthWrapper"; // Import the new wrapper
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import "./index.css";
import Logout from "./pages/Logout";
import Report from "./pages/Report";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ProfileEdit from "./pages/ProfileEdit";
import Item from "./pages/Item";
import Test from "./pages/Test";
import PricingPage from "./pages/PricingPage";
import Subscription from "./pages/Subscription";
import EditItem from "./pages/EditItem";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <NonAuthWrapper>
            <Login />
          </NonAuthWrapper>
        }
      />
      <Route
        path="/signup"
        element={
          <NonAuthWrapper>
            <Signup />
          </NonAuthWrapper>
        }
      />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/test" element={<Test />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <UserProtectedWrapper>
            <Dashboard />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/profile"
        element={
          <UserProtectedWrapper>
            <Profile />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/verify"
        element={
          <UserProtectedWrapper>
            <VerifyEmail />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/profile-update"
        element={
          <UserProtectedWrapper>
            <ProfileEdit />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/logout"
        element={
          <UserProtectedWrapper>
            <Logout />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/report"
        element={
          <UserProtectedWrapper>
            <Report />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/item/edit/:itemId"
        element={
          <UserProtectedWrapper>
            <EditItem />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/item/:itemId"
        element={
          <UserProtectedWrapper>
            <Item />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/reset-password"
        element={
          <NonAuthWrapper>
            <ResetPassword />
          </NonAuthWrapper>
        }
      />
    </Routes>
  );
}

export default App;
