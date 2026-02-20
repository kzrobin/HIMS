import "./index.css";
import { Routes, Route } from "react-router-dom";
import UserProtectedWrapper from "./pages/wrappers/UserProtectedWrapper";
import NonAuthWrapper from "./pages/wrappers/NonAuthWrapper";
import Landing from "./pages/home/Landing";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/user/Profile";
import Logout from "./pages/user/Logout";
import ReportExpairy from "./pages/report/ReportExpairy";
import Report from "./pages/report/Report";
import ResetPassword from "./pages/user/ResetPassword";
import VerifyEmail from "./pages/user/VerifyEmail";
import ProfileEdit from "./pages/user/ProfileEdit";
import ItemView from "./pages/item/ItemView";
import Test from "./pages/misc/Test";
import ItemEdit from "./pages/item/ItemEdit";

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
        path="/report-expiry"
        element={
          <UserProtectedWrapper>
            <ReportExpairy />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/item/edit/:itemId"
        element={
          <UserProtectedWrapper>
            <ItemEdit />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/item/:itemId"
        element={
          <UserProtectedWrapper>
            <ItemView />
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
