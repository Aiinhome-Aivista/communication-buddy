import React, { useState, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
export default function UpcomingModal({ isOpen, onClose, selectedTestItem }) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!selectedTestItem) return;

    const updateCountdown = () => {
      const now = new Date();
      const sessionTime = new Date(selectedTestItem.session_time);
      const diff = sessionTime - now;

      if (diff <= 0) {
        setCountdown("Started");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [selectedTestItem]);

  if (!isOpen || !selectedTestItem) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#FEFEFE] rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center shadow-xl relative"
      
        style={{
          minWidth: "min(350px, 90vw)",
          minHeight: "min(180px, 60vh)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
         
        {/* Close Button */}
        <button
          className="absolute top-1 right-1 text-[#DFB916] hover:text-[#DFB916]"
          onClick={onClose}
        >
           <CancelIcon className="w-10 h-10" />
        </button>
         <WarningIcon className="text-[#DFB916] text-[32px]" />
          <h3 className="text-sm font-semibold text-[#2C2E42] mb-1">
            A<span className="text-[#DFB916]">ii</span>nhome
            <span className="px-1">|</span>
            <span className="font-bold">CB</span>
       
      </h3>
      <h2 className="text-lg font-semibold text-[#2C2E42]">
          Upcoming Session
        </h2>
        <h2 className="text-lg font-semibold text-[#2C2E42] mt-2">
          {selectedTestItem.topic_name}
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Starts in: {countdown}
        </p>
      </div>
    </div>
  );
}