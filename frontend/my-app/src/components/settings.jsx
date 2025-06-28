import React, { useState, useRef, useEffect } from "react";

const SimpleSettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
      >
        Settings
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg overflow-hidden z-10 border border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            Update Password
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            Update User Details
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            Update Avatar
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            Update Cover Image
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleSettingsDropdown;
