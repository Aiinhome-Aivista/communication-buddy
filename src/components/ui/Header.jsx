import React, { useState, useRef, useEffect } from "react";
import Container from "./Container";
import { staticImages } from "../../utils/Constant";
import { FiBell, FiUser } from "react-icons/fi";

export default function Header() {
  const fullName = sessionStorage.getItem("userName") || "";
  const userName = fullName.split(" ")[0]; // Only first word (first name)
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, name: "John Doe", type: "arithmetic test", status: "pending" },
    { id: 2, name: "Alice", type: "MCQ test", status: "pending" },
    { id: 3, name: "Bob", type: "logical reasoning test", status: "pending" },
  ]);
  const bellRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Accept/Decline
  const handleAction = (id, action) => {
    setNotifications((prev) =>
      prev.map((prev) => (prev.id === id ? { ...prev, status: action } : prev))
    );
  };

  return (
    <header className="header-app-container h-16 bg-slate-700 flex items-center justify-between shadow border-b-2 border-teal-600">
      <Container width="w-[90%]">
        <div className="flex items-center justify-between w-full relative">
          {/* Logo */}
          <div className="company-logo py-3">
            <img
              src={staticImages.companyLogo2}
              alt="Company Logo"
              className="w-14 object-cover"
            />
          </div>

          {/* Right Section: User Info + Notification */}
          <div className="flex items-center gap-4 text-white">
            {/* User Info */}
            <div className="flex items-center justify-between gap-2 bg-teal-400/20 rounded-full min-w-24 px-1 py-1 cursor-pointer shadow-sm">
              <div className="bg-teal-600 p-1 rounded-full">
                <FiUser className="w-5 h-5 text-teal-100" />
              </div>
              <span className="text-sm font-medium pr-1 text-teal-100">{userName}</span>
            </div>

            {/* Notification Bell */}
            <div ref={bellRef} className="relative cursor-pointer">
              <FiBell
                className="w-6 h-6"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {/* Red dot for pending */}
              {notifications.some((n) => n.status === "pending") && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}

              {/* Notification Modal */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg border z-50">
                  <div className="p-4 border-b font-semibold text-slate-700">
                    Notifications
                  </div>
                  <ul className="max-h-80 overflow-y-auto divide-y">
                    {notifications.map((n) => (
                      <li key={n.id} className="p-3 text-sm text-gray-800">
                        {n.status === "pending" ? (
                          <>
                            <div className="mb-2">
                              <strong>{n.name}</strong> has requested for{" "}
                              <strong>{n.type}</strong>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-xs"
                                onClick={() => handleAction(n.id, "accepted")}
                              >
                                Accept
                              </button>
                              <button
                                className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-xs"
                                onClick={() => handleAction(n.id, "declined")}
                              >
                                Decline
                              </button>
                            </div>
                          </>
                        ) : (
                          <div
                            className={`text-sm ${
                              n.status === "accepted"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            You <strong>{n.status}</strong> {n.name}’s request
                            for <strong>{n.type}</strong>.
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                    View all
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}