import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import axios from "axios";

// email, username, password;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { checkAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { username , email, password },
        { withCredentials: true }
      );

      alert("Login successful!");
      await checkAuthStatus();
      navigate("/home"); // Redirect to homepage
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
      <div className="bg-gray-900 shadow-2xl rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p>dont have an account? <a href="/register">register</a></p>
      </div>
    </div>
  );
};

export default Login;
