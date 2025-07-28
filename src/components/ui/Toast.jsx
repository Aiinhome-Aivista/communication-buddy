import { X } from "lucide-react";
import React from "react";

const styles = {
  variant: {
    default: "bg-gray-500/40 text-gray-800",
    success: "bg-green-500/40 text-green-300 border-l-4 border-green-500",
    error: "bg-red-500/40 text-red-300 border-l-4 border-red-500",
    info: "bg-blue-500/40 text-blue-300 border-l-4 border-blue-500",
    warning: "bg-yellow-500/40 text-yellow-300 border-l-4 border-yellow-500",
  },
};

export const Toast = React.forwardRef((props, ref) => {
  React.useEffect(() => {
    console.log("effect ....");
    const duration = props?.duration || 3000;
    if (!ref?.current) return;
    const timer = setTimeout(() => {
      if (ref?.current) {
        ref?.current.classList.add("hidden");
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [props?.duration, ref]);

  const handleClose = () => {
    if (ref?.current) {
      ref?.current.classList.add("hidden");
    }
  };

  React.useImperativeHandle(ref, () => ({
    close: handleClose,
  }));
  return (
    <div
      ref={ref}
      className={`toast ${props.position} ${props.pt} ${
        styles.variant[props.variant]
      } backdrop-sepia flex gap-2 items-center`}
    >
      <div className={`toast-message ${props.messageClass}`}>
        {props.message}
      </div>

      <div className="close bg-white/20 hover:bg-white/30 rounded-full p-1 cursor-pointer">
        <X onClick={handleClose} className="text-gray-100" size={16}/>
      </div>
    </div>
  );
});

Toast.displayName = "Toast";
