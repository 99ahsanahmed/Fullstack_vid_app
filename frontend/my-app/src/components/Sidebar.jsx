import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [setting, setSettings] = useState(false);     
  return (
    <div className="w-16 md:w-64 bg-gray-800 flex-shrink-0 flex flex-col">
      {/* Sidebar Items */}
      <div className="p-4 flex flex-col space-y-4">
        <Link to="/home" className="flex gap-2">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
          </svg>
          <span className="hidden md:inline">Home</span>
        </Link>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-400 hover:text-white"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"></path>
          </svg>
          <span className="hidden md:inline">Summer Online Courses</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-400 hover:text-white"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"></path>
          </svg>
          <span className="hidden md:inline">My Courses</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-400 hover:text-white"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.97 16.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"></path>
          </svg>
          <span className="hidden md:inline">Meetups</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-400 hover:text-white"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
          </svg>
          <span className="hidden md:inline">Podcasts</span>
        </a>

        <Link
          to="/UploadVideo"
          className="flex items-center space-x-3 text-gray-400 hover:text-white"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
          </svg>
          <span className="hidden md:inline">Upload Video</span>
        </Link>

        <div>
          <div className="flex items-center space-x-3 text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
            </svg>
            <button
              className="items-center space-x-3 "
              onClick={() => setSettings(!setting)}
            >
              Settings
            </button>
          </div>
          {setting && (
            <ul>
              <Link to="/UpdateDetails">
                <li className="hover:bg-gray-900 shadow-2xl rounded-2xl px-1">
                  Update Details
                </li>
              </Link>
              <Link to="/UpdatePass">
                <li className="hover:bg-gray-900 transition-all duration-200 ease-in-out shadow-2xl rounded-2xl px-1">
                  Password settings
                </li>
              </Link>
              <Link to="/Userprofile">
                <li className="hover:bg-gray-900 shadow-2xl rounded-2xl px-1">
                  Profile
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar