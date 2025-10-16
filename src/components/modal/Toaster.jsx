import React, { useState, useEffect } from "react";
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import '../style/login.css'

function Toaster({ show, onClose, message, success }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
    } else {
      // Wait for exit animation to finish before un-rendering
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 800); // This should match the animation duration
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isRendered) {
    return null;
  }

  const animationClass = show ? 'animate-toast-enter' : 'animate-toast-exit';

  return success ? (
    // Success Toast
    <div className={`fixed inset-x-0 top-0 z-50 flex justify-center items-start p-8 ${animationClass}`}>
      <div className="flex items-center justify-between bg-[#FEFEFE] border-1 border-green-300 shadow-md sm:w-4/5 md:w-3/4 lg:w-1/2 px-2 py-1 rounded-2xl">
        <div className="flex items-center gap-3">
          <CheckCircleRoundedIcon sx={{ color: 'green' }} />
          <div className="flex flex-col text-green-700">
            <p className="text-sm font-semibold p-0">Success!</p>
            <p className="text-sm p-0">{message || "Login successful. Redirecting..."}</p>
          </div>
        </div>
        <button onClick={() => onClose()} className="text-center text-xs px-4 py-2 bg-transparent text-green-700 border-1 border-green-300 rounded-lg cursor-pointer">Close</button>
      </div>
    </div>
  ) : (
    // Failure Toast
    <div className={`fixed inset-x-0 top-0 z-50 flex justify-center items-start p-8 ${animationClass}`}>
      <div className="flex items-center justify-between bg-[#FEFEFE] border-1 border-[#FF4D014F] shadow-md sm:w-4/5 md:w-3/4 lg:w-1/2 px-2 py-1 rounded-2xl">
        <div className="flex items-center gap-3">
          <ErrorRoundedIcon sx={{ color: '#FF4D01CC' }} />
          <div className="flex flex-col text-[#FF4D01CC]">
            <p className="text-sm font-semibold p-0">Failed !</p>
            <p className="text-sm p-0">{message || "Password or username is incorrect, please try again with correct credentials."}</p>
          </div>
        </div>
        <button onClick={() => onClose()} className="text-center text-xs px-4 py-2 bg-[#3D5B8100] text-[#FF4D01CC] border-1 border-[#FF4D017D] rounded-lg cursor-pointer">Close</button>
      </div>
    </div>
  );
}

export default Toaster;
