import React from "react";
import { useState } from "react";
import { uploadImageToCloudinary } from "../utils/ImageUpload";

const Test = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState("");

  // console.log(`${import.meta.env.VITE_CLOUD_NAME}`);
  // console.log(`${import.meta.env.VITE_CLOUD_PRESET}`);

  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUD_PRESET;
  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload the selected file when the button is clicked
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "dsfwiufd239r4n23");
    data.append("cloud_name", "kz-cloud");
    console.log("dcc", selectedFile);
    
    try {
      const res = await uploadImageToCloudinary(selectedFile);

      console.log(res);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="upload-container">
        <div className="upload-icon">
          {loading ? (
            <p>Uploading.....</p>
          ) : uploadedImageURL ? (
            <img
              src={uploadedImageURL}
              alt="Uploaded"
              className="preview-img"
            />
          ) : (
            <img src="/upload-cloud-icon.png" alt="Upload Icon" />
          )}
        </div>

        <label htmlFor="file-upload" className="custom-upload-button">
          Choose a file
        </label>
        <input
          id="file-upload"
          type="file"
          className="file-input"
          onChange={handleFileChange}
        />
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {uploadedImageURL && (
        <p>
          Uploaded Image:{" "}
          <a href={uploadedImageURL} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </p>
      )}
    </div>
  );
};

export default Test;
