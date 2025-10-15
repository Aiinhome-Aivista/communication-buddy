import React from 'react';
import '../style/loader.css';

export default function LoaderNew() {
    return ( // Changed to a fixed, full-screen overlay
        <div className="fixed inset-0 flex items-center justify-center bg-[#ECEFF2] z-50">
            <div className="flex flex-col items-center text-[#BCC7D2] dark:text-gray-300">
                {/* Animated dots on top */}
                <div className="flex space-x-2 mb-3">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>

                {/* Text below */}
                <p className="text-base sm:text-lg md:text-xl font-semibold">
                    Please wait ...
                </p>
            </div>
        </div>
    );
}
