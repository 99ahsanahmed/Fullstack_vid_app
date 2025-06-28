import { useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [university, setUniversity] = useState("");
  const [isopen , setIsopen] = useState(false);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    //FORM-DATA
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("city", city);
    formData.append("role", role);
    formData.append("company", company);
    formData.append("university", university);
    formData.append("password", password);
    formData.append("avatar", avatar);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    //AXIOS-API CALL
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("User registered successfully!");
      console.log(res.data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
      <div className="bg-gray-900 shadow-2xl rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            onChange={(e) => setFullname(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <button type="button" onClick={() => setIsopen(!isopen)}>
              Role
            </button>

            {isopen && (
              <div className="mt-2 space-y-2 ">
                {/* Role Selector */}
                <select
                  name="role"
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="p-2 border rounded-md focus:ring-2 bg-gray-900 focus:ring-blue-500 w-full"
                  value={role}
                >
                  <option value="">Select role</option>
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </select>

                {/* Conditional Input based on Role */}
                {role && (
                  <input
                    type="text"
                    name={role === "student" ? "university" : "company"}
                    placeholder={
                      role === "student"
                        ? "Enter University Name"
                        : "Enter Company Name"
                    }
                    onChange={ role === "student"? (e) => setUniversity(e.target.value) : (e) => setCompany(e.target.value)}
                    required
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                  />
                )}
              </div>
            )}
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-600">
            Avatar
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
            className="p-2 border rounded-md"
          />

          <label className="block text-sm font-medium text-gray-600">
            Cover Image (Optional)
          </label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="p-2 border rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        already have an account? <a href="/">Login</a>
      </div>
    </div>
  );
};

export default Register;
