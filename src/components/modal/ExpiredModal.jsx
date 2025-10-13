import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/WarningRounded';

export default function ExpiredModal({ isOpen, onClose, selectedTestTitle }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] bg-black/30 backdrop-blur-sm"
      onClick={onClose} // close when clicking outside modal
    >
      <div
        className="bg-[#FEFEFE] rounded-2xl p-8 min-w-[420px]  min-h-[220px]  sm:p-10 flex flex-col items-center justify-center shadow-xl relative"
      
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-1 right-1 text-[#DFB916] hover:text-[#DFB916]"
          onClick={onClose}
        >
            <CancelIcon className="w-10 h-10" />
        </button>

        <div className="flex justify-center mb-3">
        <div className="flex items-center justify-center">
            <WarningIcon sx={{ color: "#DFB916", fontSize: 48 }} />
        </div>
      </div>

      {/* Aiihome | CB Title */}
     <h3 className="text-sm font-semibold text-[#2C2E42] mb-1">
            A<span className="text-[#DFB916]">ii</span>nhome
            <span className="px-1">|</span>
            <span className="font-bold">CB</span>
       
      </h3>

      {/* Message */}
      <p className="text-[20px] font-bold text-[#2C2E42] mb-6">
        Your session is expired!
      </p>
      </div>
    </div>
  );
}