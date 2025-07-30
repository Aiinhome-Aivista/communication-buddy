import React, { useState, useEffect } from "react";
import Container from "./Container";
import { staticImages } from "../../utils/Constant";
import { FiBell, FiUser } from "react-icons/fi";
import Notification from "./Notification";
import { useTopic } from "../../provider/TopicProvider";

export default function Header() {
  const { getTopicData } = useTopic();
  const fullName = sessionStorage.getItem("userName") || "";
  const userRole = sessionStorage.getItem("userRole") || "";
  const userName = fullName.split(" ")[0];
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  //  useEffect to filter topics where status is null
  useEffect(() => {
    if (getTopicData && getTopicData.length > 0) {
      const onlyPendingStatus = getTopicData.filter(topic => topic.status === "pending");
      setNotifications(onlyPendingStatus);
    }
  }, [getTopicData]);
  const handleAction = (id, action) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: action } : n))
    );
  };

  return (
    <header className="header-app-container h-16 bg-slate-700 flex items-center justify-between shadow border-b-2 border-teal-600">
      <Container width="w-[90%]">
        <div className="flex items-center justify-between w-full relative">
          {/* Logo */}
          <div className="company-logo py-3">
            <img src={staticImages.companyLogo2} alt="Company Logo" className="w-14 object-cover" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 text-white">
            {/* User Info */}
            <div className="flex items-center gap-2 bg-teal-400/20 rounded-full min-w-24 px-2 py-1 cursor-pointer shadow-sm">
              <div className="bg-teal-600 p-1 rounded-full">
                <FiUser className="w-5 h-5 text-teal-100" />
              </div>
              <span className="text-sm font-medium text-teal-100">{userName}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <FiBell
                className="w-6 h-6 cursor-pointer"
                onClick={() => setShowNotifications(true)}
              />
              {/* Red dot if any pending */}
              {notifications.some((n) => n.status === "pending") && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}

              {/* Reusable Dropdown */}
              {showNotifications && (
                <Notification
                  notifications={notifications}
                  onAction={handleAction}
                  onClose={() => setShowNotifications(false)}
                  role={userRole}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
