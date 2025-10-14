import React from 'react';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CancelIcon from '@mui/icons-material/Cancel';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[50] bg-black/30 backdrop-blur-sm"
        
        >
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[420px]  min-h-[220px] max-w-[420px]  max-h-[220px] text-center relative">
                {/* Cancel icon at top right */}
                <button
                    onClick={onClose}
                    className="absolute top-1 right-1 text-[#DFB916]  transition"
                    aria-label="Close"
                >
                    <CancelIcon className="w-7 h-7" />
                </button>
                <WarningRoundedIcon sx={{ color: "#DFB916", fontSize: 48 }} />
                <h3 className="text-sm font-semibold text-[#2C2E42] mb-1">
                    A<span className="text-[#DFB916]">ii</span>nhome
                    <span className="px-1">|</span>
                    <span className="font-bold">CB</span>
                </h3>
                <p className="mb-6 text-[#2C2E42] font-extrabold">Are you sure you want to logout?</p>
                <div className="flex justify-center gap-4">
                    <button
                       className="h-8 w-15 border border-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
                
                        onClick={async () => {
                            await onConfirm();
                            onClose();
                        }}
                    >
                        Yes
                    </button>
                    <button
                       className="h-8 w-15 border border-[#DFB916] bg-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
        
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}