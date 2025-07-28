import React from "react";
import { fatchedPostRequest, postURL } from "../services/ApiService";

const authContext = React.createContext({
  isAuthenticated: () => false,
  login: () => Promise.resolve(),
  logout: () => {},
  isLoading: false,
  isError: false,
});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => !!sessionStorage.getItem("success");

  const login = async (userInfo) => {
    setIsLoading(true);
    try {
      const response = await fatchedPostRequest(postURL.login, userInfo);
      if (response.success || response.status === 200) {
        console.log("login userInfo: ", response.success);
        sessionStorage.setItem("userName", response.name);
        sessionStorage.setItem("userRole", response.role);
        sessionStorage.setItem("success", response.success);
        sessionStorage.setItem("user_id", response.user_id);
        setIsLoading(false);
        return { success: true };
      } else {
        console.log("Login failed:", response.message);
        alert(response.message || "Login failed");
        setIsLoading(false);
        setIsError(true);
        return { success: false };
      }
    } catch (error) {
      // Handle error during login
      setIsLoading(false);
      setIsError(true);
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please try again.");
      return { success: false };
    }
  };

  const logout = () => {
    sessionStorage.clear();
  };

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isLoading,
        isError,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
