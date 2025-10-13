import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; 

export default function ExpiredModal({ isOpen, onClose, selectedTestTitle }) {
  return (
    <Dialog
      header="Session Expired"
      visible={isOpen}
      onHide={onClose}
      style={{ width: "350px"}}
      className="custom-dialog"
     
    

    >
      <div className="flex flex-col items-center justify-center text-center">

         <img
          src="public/assets/icons/warning.png"
          alt="Warning"
          className="w-10 h-10 mb-2"
        />

        <h2 className="text-lg font-semibold text-[#2C2E42]">
          Your session has expired
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          The test <strong>{selectedTestTitle}</strong> is no longer available.
        </p>
      </div>
    </Dialog>
  );
}

// import React from "react";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import CloseIcon from "@mui/icons-material/Close";

// export default function ExpiredModal({ isOpen, onClose, selectedTestTitle }) {
//   if (!isOpen) return null; 

//   return (
//     <div
//       className="fixed inset-1 flex items-center justify-center z-[60]"
//       onClick={onClose} // close when clicking outside modal
//     >
//       <div
//         className="bg-[#FEFEFE] rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center shadow-xl"
//         style={{
//           minWidth: "min(400px, 90vw)",
//           minHeight: "min(200px, 60vh)",
//         }}
//         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//       >
//           <button
//           className="absolute top-4 right-4 text-gray-400 hover:text-[#DFB916]"
//           onClick={onClose}
//         >
//           <CloseIcon />
//         </button>
//         {/* Warning Icon */}
//         <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
//           <WarningAmberIcon sx={{ fontSize: "4rem", color: "#DFB916" }} />
//         </div>

//         {/* Logo / Title */}
//         <p className="w-full flex text-lg md:text-xl text-[#2C2E42] justify-center">
//           A<span className="text-[#DFB916]">ii</span>nhome
//           <span className="px-1">|</span>
//           <span className="font-bold">CB</span>
//         </p>

//         {/* Message */}
//         <p className="text-sm text-gray-600 mt-2 text-center">
//           The test <strong>{selectedTestTitle}</strong> is no longer available.
//         </p>

   
//       </div>
//     </div>
//   );
// }
