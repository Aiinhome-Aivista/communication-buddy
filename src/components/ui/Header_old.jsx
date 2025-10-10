import React, { useState, useEffect } from "react";
import Container from "./Container";
import { staticImages } from "../../utils/Constant";
import { FiBell, FiUser, FiVolume2 } from "react-icons/fi";
import Notification from "./Notification";
import { useTopic } from "../../provider/TopicProvider";

export default function Header() {
  const { getTopicData } = useTopic();
  const fullName = sessionStorage.getItem("userName") || "";
  const userRole = sessionStorage.getItem("userRole") || "";
  const userName = fullName.split(" ")[0];
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [voiceGender, setVoiceGender] = useState("female"); // ✅ Default to female voice
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);

  //  useEffect to filter topics where status is null
  useEffect(() => {
    if (getTopicData && getTopicData.length > 0) {
      const onlyPendingStatus = getTopicData.filter(topic => topic.status === "pending");
      setNotifications(onlyPendingStatus);
    }
  }, [getTopicData]);

  // ✅ Load saved voice gender preference
  useEffect(() => {
    const savedGender = localStorage.getItem("voiceGender") || "female";
    setVoiceGender(savedGender);
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVoiceDropdown && !event.target.closest('.voice-dropdown-container')) {
        setShowVoiceDropdown(false);
      }
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVoiceDropdown, showNotifications]);

  const handleAction = (id, action) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: action } : n))
    );
  };

  // ✅ Enhanced voice gender change handler with localStorage clearing
  const handleVoiceGenderChange = (gender) => {
    console.log("🎵 Header: Changing voice gender from", voiceGender, "to", gender);
    
    try {
      // ✅ Clear previous localStorage first for clean state
      localStorage.removeItem("voiceGender");
      
      // ✅ Set new value
      setVoiceGender(gender);
      localStorage.setItem("voiceGender", gender);
      
      console.log("✅ Header: Voice gender updated in localStorage:", gender);
      
      // ✅ Dispatch event immediately to notify chatbot component
      window.dispatchEvent(new CustomEvent("voiceGenderChanged", { 
        detail: { 
          newGender: gender, 
          timestamp: Date.now(),
          source: 'header'
        }
      }));
      console.log("✅ Header: Voice gender change event dispatched for", gender);
      
      setShowVoiceDropdown(false);
    } catch (error) {
      console.error("❌ Error changing voice gender:", error);
    }
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

            {/* Voice Gender Dropdown */}
            {/* <div className="relative voice-dropdown-container">
              <div 
                className="flex items-center gap-2 bg-teal-500/20 rounded-lg px-3 py-2 cursor-pointer hover:bg-teal-500/30 transition-colors"
                onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
              >
                <FiVolume2 className="w-4 h-4 text-teal-200" />
                <span className="text-sm font-medium text-teal-100 capitalize">{voiceGender}</span>
                <svg 
                  className={`w-4 h-4 text-teal-200 transition-transform ${showVoiceDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div> */}

              {/* Voice Dropdown Menu */}
              {/* {showVoiceDropdown && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px] z-50">
                  <div className="py-1">
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        voiceGender === 'male' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => handleVoiceGenderChange('male')}
                    >
                      <div className="flex items-center gap-2"> */}
                        {/* <span>👨</span> */}
                        {/* <span>Male</span>
                        {voiceGender === 'male' && <span className="ml-auto text-teal-600">✓</span>}
                      </div>
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        voiceGender === 'female' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => handleVoiceGenderChange('female')}
                    >
                      <div className="flex items-center gap-2"> */}
                        {/* <span>👩</span> */}
                        {/* <span>Female</span>
                        {voiceGender === 'female' && <span className="ml-auto text-teal-600">✓</span>}
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div> */}

            {/* Notification Bell */}
            <div className="relative notification-container">
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
