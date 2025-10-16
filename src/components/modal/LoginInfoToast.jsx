import React, { useState, useEffect } from "react";
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import '../style/login.css'

function LoginInfoToast({ show, onClose, message, success }) {
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

  const toastConfig = success
    ? {
      Icon: CheckCircleRoundedIcon,
      iconColor: 'green',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      title: 'Success!',
      defaultMessage: 'Login successful. Redirecting...',
      buttonBorderColor: 'border-green-300',
    }
    : {
      Icon: ErrorRoundedIcon,
      iconColor: '#FF4D01CC',
      borderColor: 'border-[#FF4D014F]',
      textColor: 'text-[#FF4D01CC]',
      title: 'Failed!',
      defaultMessage: 'Password or username is incorrect, please try again with correct credentials.',
      buttonBorderColor: 'border-[#FF4D017D]',
    };

  const { Icon, iconColor, borderColor, textColor, title, defaultMessage, buttonBorderColor } = toastConfig;

  return (
    <div className={`fixed inset-x-0 top-0 z-50 flex justify-center items-start p-8 ${animationClass}`} role="alert">
      <div className={`flex items-center justify-between bg-[#FEFEFE] border-1 ${borderColor} shadow-md sm:w-4/5 md:w-3/4 lg:w-1/2 px-2 py-1 rounded-2xl`}>
        <div className="flex items-center gap-3">
          <Icon sx={{ color: iconColor }} />
          <div className={`flex flex-col ${textColor}`}>
            <p className="text-sm font-semibold p-0">{title}</p>
            <p className="text-sm p-0">{message || defaultMessage}</p>
          </div>
        </div>
        <button onClick={() => onClose()} className={`text-center text-xs px-4 py-2 bg-transparent ${textColor} border-1 ${buttonBorderColor} rounded-lg cursor-pointer`}>Close</button>
      </div>
    </div>
  );
}

export default LoginInfoToast;
