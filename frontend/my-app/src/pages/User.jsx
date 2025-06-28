import React, { useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import { Link } from "react-router-dom";

const User = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-start pt-12">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-48 w-full">
          <img
            src={user.coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />
          {/* Avatar positioned to overlap the cover image */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={user.avatar}
              alt="profile picture"
              className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
            />
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="pt-20 pb-8 px-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {user.username}
            </h1>
            <span className="inline-block bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm">
              {user.role}
            </span>
          </div>

          <div className="space-y-3 text-gray-300">
            <p className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Email</span>
              <span>{user.email}</span>
            </p>
            <p className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">City</span>
              <span>{user.city}</span>
            </p>
            {user.role === "student" && (
              <p className="flex items-center justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">University</span>
                <span>{user.university}</span>
              </p>
            )}
            {user.role === "tutor" && (
              <p className="flex items-center justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Company</span>
                <span>{user.company}</span>
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <Link
          to="/home"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>
    </div>
  );
};

export default User;
