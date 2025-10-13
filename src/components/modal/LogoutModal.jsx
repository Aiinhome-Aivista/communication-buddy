import React from 'react';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
                background: "rgba(0,0,0,0.18)",
                backdropFilter: "blur(6px)"
            }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] text-center">
                <WarningRoundedIcon sx={{ color: "#DFB916", fontSize: 48 }} />
                <h2 className="text-lg font-semibold my-4 text-[#2C2E42]">Logout</h2>
                <p className="mb-6 text-[#7E8489]">Are you sure you want to logout?</p>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-6 py-2 rounded-lg bg-[#E5B800] text-[#272727] font-semibold cursor-pointer"
                        onClick={async () => {
                            await onConfirm();
                            onClose();
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-gray-200 text-[#272727] font-semibold cursor-pointer"
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}