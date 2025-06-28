import React , {useState, useContext} from 'react'
import { AuthContext } from "../context/Authcontext";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user, logout } = useContext(AuthContext);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVideos(searchQuery, 1); // Reset to page 1 when searching
        setCurrentPage(1);
  };
  return (
    <nav className="px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Ustaad Connect</h1>
      </div>

      <div className="flex-1 mx-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for videos..."
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-lg">{user?.username}</span>
          {user?.role === "student" && <span>{user?.university}</span>}
          {user?.role === "tutor" && <span>{user?.company}</span>}
          <span className="bg-black rounded-4xl p-2">{user?.city}</span>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar