import React from "react";
import { fatchedPostRequest, postURL } from "../services/ApiService";

const authContext = React.createContext({
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logout: () => { },
  isLoading: false,
  isError: false,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => !!sessionStorage.getItem("success"));
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const login = async (userInfo) => {
    setIsLoading(true);
    try {
      const response = await fatchedPostRequest(postURL.login, userInfo);
      if (response.success || response.status === 200) {
        sessionStorage.setItem("userName", response.name);
        sessionStorage.setItem("userRole", response.role);
        sessionStorage.setItem("success", "true");
        sessionStorage.setItem("user_id", response.user_id);
        setTimeout(() => {
          setIsAuthenticated(true); // ✅ Set it after a delay
        }, 3000);
        setIsLoading(false);
        return { success: true, userName: response.name };
      } else {
        setIsLoading(false);
        setIsError(true);
        return { success: false, message: response.message || "Login failed" };
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      return { success: false, message: "An error occurred while logging in. Please try again." };
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false); // ✅ Reset
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
