import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../App";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, inputs);
    setCurrentUser(res?.data);
  };

  const logout = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      if (res.status !== 200) {
        setCurrentUser(currentUser);
      }

      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
