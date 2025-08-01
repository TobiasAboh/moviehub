"use client";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.loggedIn) {
            setLoggedIn(true);
            setEmail(data.email);
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, email }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
