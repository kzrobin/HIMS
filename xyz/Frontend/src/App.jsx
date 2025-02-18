import { Routes, Route } from "react-router-dom";
import UserProtectedWraper from "./pages/UserProtectedWraper";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <UserProtectedWraper authOnly={false}>
            <Login />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/signup"
        element={
          <UserProtectedWraper authOnly={false}>
            <Signup />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/dashboard"
        element={
          <UserProtectedWraper>
            <Dashboard />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/profile"
        element={
          <UserProtectedWraper>
            <Profile />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/verify"
        element={
          <UserProtectedWraper>
            <VerifyEmail />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/profile-update"
        element={
          <UserProtectedWraper>
            <ProfileEdit />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/logout"
        element={
          <UserProtectedWraper>
            <Logout />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/report"
        element={
          <UserProtectedWraper>
            <Report />
          </UserProtectedWraper>
        }
      />
      <Route
        path="/item/:itemId"
        element={
          <UserProtectedWraper>
            <Item />
          </UserProtectedWraper>
        }
      />

      <Route
        path="/reset-password"
        element={
          // <UserProtectedWraper>
          //   <ResetPassword />
          // </UserProtectedWraper>
          <ResetPassword />
        }
      />
      <Route path="/test" element={<Test />}></Route>
    </Routes>
  );
}

export default App;
