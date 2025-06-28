import { createContext, useState, useEffect } from "react";
import axios from "axios"; // Import Axios directly

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/current-user",
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (res.data && res.data.statuscode) {
        setUser(res.data.data);
      }
    } catch (error) {
      setUser(null);
    }finally{
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:8000/api/v1/users/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,loading, checkAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext
