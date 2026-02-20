import axios from "axios";

/**
 * Uploads an image to Cloudinary.
 * @param {File} file - The image file to upload.
 * @param {string} cloudName - Your Cloudinary cloud name.
 * @param {string} uploadPreset - Your Cloudinary upload preset.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file) => {
  // console.log("Cloud function", file);
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "dsfwiufd239r4n23");
  data.append("cloud_name", "kz-cloud");

  // console.log("get called");
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/kz-cloud/image/upload`,
      data,
      {
        withCredentials: false, // Remove this if not required
      }
    );

    // console.log("Checked out cloud function ", response);
    return response.data.secure_url;
  } catch (error) {
    // console.error("Error uploading image:", error);
    // throw error;
    return null;
  }
};
