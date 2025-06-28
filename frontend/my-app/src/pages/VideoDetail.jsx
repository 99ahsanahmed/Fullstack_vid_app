import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useVideo } from "../context/VideoContext";
import { AuthContext } from "../context/Authcontext";
import Sidebar from "../components/Sidebar";

const VideoDetail = () => {
  const { videoId } = useParams();
  const { videos, loading } = useVideo();
  const [video, setVideo] = useState({});
  const { user } = useContext(AuthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (!loading && videos?.length > 0) {
      const foundVideo = videos.find((v) => v._id === videoId);
      setVideo(foundVideo || {});

      // Find related videos (same owner or similar title)
      if (foundVideo) {
        const related = videos
          .filter(
            (v) =>
              v._id !== videoId &&
              (v.owner._id === foundVideo.owner._id ||
                v.title
                  .toLowerCase()
                  .includes(foundVideo.title.toLowerCase().split(" ")[0]))
          )
          .slice(0, 4);
        setRelatedVideos(related);
      }
    }
  }, [videos, loading, videoId]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  if (!video || !video._id) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
          <p className="mb-6">
            The video you're looking for might have been removed or is
            unavailable.
          </p>
          <Link
            to="/videos"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Ustaad Connect
          </Link>
        </div>

        <div className="flex-1 mx-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for videos..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white">
              <span className="text-xl">🔍</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-lg">{user?.username}</span>
            <span className="bg-black rounded-lg p-2">{user?.city}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto pb-8">
          {/* Video Player Section */}
          <div className="w-full bg-black">
            <div className="max-w-5xl mx-auto relative pt-[56.25%]">
              {" "}
              {/* 16:9 Aspect Ratio */}
              <video
                className="absolute top-0 left-0 w-full h-full"
                controls
                poster={video?.thumbnail}
                src={video?.videoFile}
                autoPlay={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>

          {/* Video Info Section */}
          <div className="max-w-5xl mx-auto px-4 mt-6">
            <h1 className="text-3xl font-bold mb-2">{video?.title}</h1>

            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">
                  Uploaded {formatDate(video?.createdAt)}
                </span>
                <span className="text-gray-400">
                  • {video?.duration} minutes
                </span>
              </div>

              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <span className="text-xl">👍</span>
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <span className="text-xl">💾</span>
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <span className="text-xl">🔗</span>
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={video?.owner?.avatar}
                  alt={video?.owner?.username}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">
                    {video?.owner?.username}
                  </h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>{video?.owner?.company}</span>
                    <span className="mx-2">•</span>
                    <span>{video?.owner?.city}</span>
                  </div>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors">
                Connect with Instructor
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-300 whitespace-pre-line">
                {video?.description}
              </p>
            </div>

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Related Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedVideos.map((relVideo) => (
                    <Link
                      to={`/video/${relVideo._id}`}
                      key={relVideo._id}
                      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={relVideo.thumbnail}
                          alt={relVideo.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-xs px-2 py-1 rounded">
                          {relVideo.duration} min
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold line-clamp-2">
                          {relVideo.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {relVideo.owner.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section - You can add this later */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex">
                  <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Sample comments - you can make these dynamic later */}
                <div className="mt-6 space-y-4">
                  <div className="flex space-x-3">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold">John Doe</h4>
                        <span className="text-xs text-gray-400 ml-2">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">
                        Great tutorial! Really helped me understand the basics.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold">Sarah Smith</h4>
                        <span className="text-xs text-gray-400 ml-2">
                          1 week ago
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">
                        Looking forward to the next part of this series!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
