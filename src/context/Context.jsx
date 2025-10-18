import { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({});
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

// Toaster Context
export const ToasterContext = createContext({
  show: false,
  message: "",
  status: "error",
  showToaster: () => { },
  hideToaster: () => { },
});

export function ToasterProvider({ children }) {
  const [toasterState, setToasterState] = useState({
    show: false,
    message: "",
    status: "error", // 'success' or 'error'
  });

  const showToaster = (message, status = "success") => {
    setToasterState({ show: true, message, status });
  };

  const hideToaster = () => {
    setToasterState((prevState) => ({ ...prevState, show: false }));
  };

  return <ToasterContext.Provider value={{ ...toasterState, showToaster, hideToaster }}>{children}</ToasterContext.Provider>;
}

// Custom hook to use the toaster
export const useToaster = () => useContext(ToasterContext);