import React from 'react';
import '../style/loader.css';

export default function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[100vh] rounded-lg mt-8">
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
