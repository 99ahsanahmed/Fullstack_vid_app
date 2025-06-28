import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const UploadVid = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState();
  const [videoFile, setvideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    try {
      await axios.post(
        "http://localhost:8000/api/v1/videos/uploadVideo",
        formData,
        {
          withCredentials: true, // Ensure cookies are sent
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage({ text: "Video uploaded successfully!", type: "success" });
    } catch (error) {
      console.log(error);
      setMessage({
        text: "Error uploading video. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="h-screen w-screen bg-gray-900 text-white flex">
        <Sidebar />
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Upload a Video
          </h1>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded ${
                message.type === "success"
                  ? "bg-green-600 bg-opacity-20 text-green-300"
                  : "bg-red-600 bg-opacity-20 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Video Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter video title"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe your video"
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                placeholder="Video duration in minutes"
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">
                Thumbnail Image
              </label>
              <div className="border border-dashed border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  name="thumbnail"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="w-full text-gray-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-red-500 file:text-white hover:file:bg-red-600"
                  required
                />
                {thumbnail && (
                  <p className="mt-2 text-sm text-gray-400">
                    Selected: {thumbnail.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Video File</label>
              <div className="border border-dashed border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  name="videoFile"
                  onChange={(e) => setvideoFile(e.target.files[0])}
                  className="w-full text-gray-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-red-500 file:text-white hover:file:bg-red-600"
                  required
                />
                {videoFile && (
                  <p className="mt-2 text-sm text-gray-400">
                    Selected: {videoFile.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 transition-colors"
              }`}
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadVid;
