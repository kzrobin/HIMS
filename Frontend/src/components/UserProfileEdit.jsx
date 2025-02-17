import React, { useContext, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const UserProfileEdit = ({ onCancel }) => {
  const { user, setUser } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    firstname: user.fullname.firstname,
    lastname: user.fullname.lastname,
  });
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [previewPicture, setPreviewPicture] = useState(user.profilePicture); // Temporary preview
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditProfilePictureModal, setShowEditProfilePictureModal] =
    useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPicture(reader.result); // Update preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const validateName = () => {
    if (formData.firstname.length < 2) {
      setError("First name should be at least two characters long");
      return false;
    }
    if (formData.lastname.length < 3) {
      setError("Last name should be at least three characters long");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least six characters long");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }
    return true;
  };

  const updateName = async () => {
    if (!validateName()) return;

    try {
      const response = await axios.put(
        "/users/update-name",
        {
          fullname: {
            firstname: formData.firstname,
            lastname: formData.lastname,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data.user);
      setSuccess("Name updated successfully");
      setError("");
      setShowEditNameModal(false); // Close the modal after successful update
    } catch (err) {
      setError(err.response?.data?.message || "Error updating name");
    }
  };

  const updateProfilePicture = async () => {
    try {
      const response = await axios.put(
        "/users/update-profile-picture",
        {
          profilePicture: previewPicture, // Use the preview picture for the API call
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data.user);
      setProfilePicture(previewPicture); // Update the actual profile picture
      setSuccess("Profile picture updated successfully");
      setError("");
      setShowEditProfilePictureModal(false); // Close the modal after successful update
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile picture");
    }
  };

  const cancelProfilePictureChange = () => {
    setPreviewPicture(profilePicture); // Reset the preview to the original profile picture
    setShowEditProfilePictureModal(false); // Close the modal
  };

  const updatePassword = async () => {
    if (!validatePassword()) return;

    try {
      await axios.put(
        "/users/update-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess("Password updated successfully");
      setError("");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowEditPasswordModal(false); // Close the modal after successful update
    } catch (err) {
      setError(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className=" max-h-full overflow-auto bg-[#F9F9F9] p-4 sm:p-8 custom-scroll">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C542A] mb-6">
          Edit Profile
        </h1>

        {/* Set Profile Image */}
        <div className="flex flex-col items-center gap-4 border-b pb-6">
          <img
            src={profilePicture} // Use the actual profile picture
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-[#3BCD5B]"
          />
          <button
            onClick={() => setShowEditProfilePictureModal(true)}
            className="bg-gradient-to-r from-[#62b878] via-[#4FCF70] to-[#3BCD5B] text-white px-6 py-2 rounded-lg hover:from-[#3BCD5B] hover:via-[#34D399] hover:to-[#2FAF60] transition-colors"
          >
            Edit Profile Picture
          </button>
        </div>

        {/* Edit Profile Picture Modal */}
        {showEditProfilePictureModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
              <h2 className="text-xl font-semibold text-[#1C542A] mb-4">
                Update Profile Picture
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={previewPicture} // Use the preview picture
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-[#3BCD5B]"
                />
                <label className="cursor-pointer bg-gray-400 text-white px-3 py-2 text-sm rounded-lg hover:bg-gray-500 transition-colors">
                  Upload New Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={updateProfilePicture}
                  className="bg-gradient-to-r from-[#62b878] via-[#4FCF70] to-[#3BCD5B] text-white px-6 py-2 rounded-lg hover:from-[#3BCD5B] hover:via-[#34D399] hover:to-[#2FAF60] transition-colors"
                >
                  Save Profile Picture
                </button>
                <button
                  onClick={cancelProfilePictureChange}
                  className="bg-gray-200 text-[#1C542A] px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors ml-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Name Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-[#1C542A] mb-4">Name</h2>
          <p className="text-gray-600 font-semibold text-lg">
            {user.fullname.firstname} {user.fullname.lastname}
          </p>
          <button
            onClick={() => setShowEditNameModal(true)}
            className="bg-gradient-to-r from-[#62b878] via-[#4FCF70] to-[#3BCD5B] text-white px-6 py-2 rounded-lg hover:from-[#3BCD5B] hover:via-[#34D399] hover:to-[#2FAF60] transition-colors mt-2"
          >
            Edit Name
          </button>
        </div>

        {/* Edit Name Modal */}
        {showEditNameModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
              <h2 className="text-xl font-semibold text-[#1C542A] mb-4">
                Update Name
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={updateName}
                  className="bg-gradient-to-r from-[#62b878] via-[#4FCF70] to-[#3BCD5B] text-white px-6 py-2 rounded-lg hover:from-[#3BCD5B] hover:via-[#34D399] hover:to-[#2FAF60] transition-colors"
                >
                  Save Name
                </button>
                <button
                  onClick={() => setShowEditNameModal(false)}
                  className="bg-gray-200 text-[#1C542A] px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors ml-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Password Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-[#1C542A] mb-4">
            Update Password
          </h2>
          <button
            onClick={() => setShowEditPasswordModal(true)}
            className="bg-gradient-to-r from-[#62b878] via-[#4FCF70] to-[#3BCD5B] text-white px-6 py-2 rounded-lg hover:from-[#3BCD5B] hover:via-[#34D399] hover:to-[#2FAF60] transition-colors"
          >
            Change Password
          </button>
        </div>

        {/* Edit Password Modal */}
        {showEditPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
              <h2 className="text-xl font-semibold text-[#1C542A] mb-4">
                Update Password
              </h2>
              <div className="space-y-4">
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Old Password"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={updatePassword}
                  className="bg-gradient-to-r from-[#62b878] via-[#4FCF70] to-[#3BCD5B] text-white px-6 py-2 rounded-lg hover:from-[#3BCD5B] hover:via-[#34D399] hover:to-[#2FAF60] transition-colors"
                >
                  Save Password
                </button>
                <button
                  onClick={() => setShowEditPasswordModal(false)}
                  className="bg-gray-200 text-[#1C542A] px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors ml-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {success && (
          <div className="mt-4 text-green-600 text-center">{success}</div>
        )}

        {/* Cancel Button */}
        <Link to="/profile" className="flex justify-end mt-8">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-[#1C542A] px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfileEdit;
