import React, {useContext} from "react";
import { Link } from "react-router-dom"; 
import { AuthContext } from "../context/Authcontext";
const VideoCard = ({
  videoId,
  videoName = "Video title",
  instructorName = "Instructor name",
  company = "company",
  thumbnailUrl,
  videoUrl,
  duration = "0:00",
  uploadDate,
  city = "karachi",
  rating = 4.0,
}) => {
  const { user } = useContext(AuthContext)
  // Calculate filled and empty stars based on rating
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Format the date
  const formattedDate = new Date(uploadDate).toLocaleDateString();

  // Format duration if it's in seconds
  const formatDuration = (duration) => {
    if (typeof duration === "number") {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
    return duration;
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full transition-all duration-300 hover:shadow-xl hover:scale-105">
      {/* Video thumbnail with play button overlay */}
      <div className="relative bg-gray-200 w-full h-40 rounded-md mb-3 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={videoName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
            NO THUMBNAIL
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(duration)}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 my-3"></div>

      {/* Video details */}
      <div className="flex flex-col">
        <Link to={`/video/${videoId}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-900">
            {videoName}
          </h3>
        </Link>
        <Link to={`/Instructorprofile/${instructorName}`}>
          <p className="text-sm underline text-gray-600 mt-1">
            {instructorName}
          </p>
        </Link>
        <p className="text-gray-600 text-sm"> works at {company}</p>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">{city}</p>
          <p className="text-gray-500 text-xs">{formattedDate}</p>
        </div>

        {/* Rating section */}
        <div className="flex items-center mt-2">
          <span className="text-amber-500 font-bold mr-2">
            {rating.toFixed(1)}
          </span>
          <div className="flex">
            {/* Render full stars */}
            {[...Array(fullStars)].map((_, i) => (
              <svg
                key={`full-${i}`}
                className="w-4 h-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Watch button */}
        <div className="mt-3">
          <Link to={`/video/${videoId}`}>
            <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-full font-medium transition-all duration-300 hover:bg-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Watch Video
            </button>
          </Link>
        </div>
      </div>
      {/* <video className="w-32" controls src={videoUrl}></video> */}
    </div>
  );
};

export default VideoCard;
