import React, { useEffect } from "react";

const SuccessModal = ({ open, onClose }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[50]">
            <div
                className="bg-[#FEFEFE] rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center shadow-xl"
                style={{
                    minWidth: "min(551px, 90vw)",
                    minHeight: "min(308px, 60vh)",
                }}
            >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <img
                        src="assets/icons/verified.png"
                        alt="verified"
                        className="w-20 h-20"
                    />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2E42] mb-2 text-center">
                    Aiinhome | CB
                </h2>
                <p className="text-xl font-semibold text-[#2C2E42] text-center">
                    Session Created Successfully
                </p>
            </div>
        </div>
    );
};

export default SuccessModal;
