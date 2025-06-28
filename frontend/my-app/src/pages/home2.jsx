import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Authcontext";
import VideoCard from "../components/VideoCard"; // We'll create this component
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import  {useVideo}  from "../context/VideoContext";
import { motion } from "motion/react";


const Videos = () => {
  
  const { videos, loading, total } = useVideo();
  // const [videos, setVideos] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Music",
    "Photography",
  ];
  const limit = 8; // Number of videos per page

  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when changing categories
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col">
      {/* Navigation Bar */}
      <Navbar/>
      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Categories */}
          <div className="p-4 overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${
                    selectedCategory === category
                      ? "bg-red-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-10">{error}</div>
          ) : (
            <>
              <h1 className="text-center mb-8 text-xl font-semibold">
                {selectedCategory === "All"
                  ? "Courses"
                  : `${selectedCategory} Videos`}
                <span className="text-gray-400 text-sm ml-2">
                  ({total} found)
                </span>
              </h1>

              {/* Videos Grid */}
              {!videos || videos.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No videos found. Try a different search or category.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 gap-10">
                  {videos.map((video) => (
                    <VideoCard
                      key={video._id}
                      videoId={video._id}
                      videoName={video.title}
                      instructorName={video.owner.username}
                      company={video.owner.company || ""}
                      thumbnailUrl={video.thumbnail}
                      videoUrl={video.videoFile}
                      duration={video.duration}
                      uploadDate={video.createdAt}
                      city={video.owner.city || ""}
                      rating={video.rating || 4.0}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 my-8">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                      currentPage === 1
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page + 1
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Videos;
