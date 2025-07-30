import React, { useState } from 'react'
import { useLocation } from 'react-router';

export default function RequestNotification() {
  const location = useLocation();
  const notifications = location.state?.notifications || [];
  console.log('notifications in request page :', notifications);
  const [currentIndex, setCurrentIndex] = useState(0);
  const userRole = sessionStorage.getItem("userRole") || ""; // Default to candidate if not set
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : notifications.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < notifications.length - 1 ? prev + 1 : 0));
  };
  return (
    <>
      <h1 className="text-2xl font-bold text-teal-300">All Notifications </h1>
      <div className="flex flex-col items-center justify-center ">

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <div className="relative w-[80%] max-w-3xl bg-teal-50 border rounded-lg shadow p-6">

            {/* ✅ Notification Number */}
            <div className="text-lg font-bold mb-2">{currentIndex + 1}</div>

            {userRole === "candidate" ? (
              <p className="text-gray-700 leading-relaxed">
                Your request for <strong>{notifications[currentIndex].topic_name}</strong> is currently{" "}
                <strong className="text-orange-500">{notifications[currentIndex].status}</strong>.
              </p>
            ) : (
              <p className="text-gray-700 leading-relaxed">{notifications[currentIndex].message}</p>
            )}

            {/* ✅ Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-blue-500 text-white w-8 h-8 rounded-full shadow hover:bg-blue-600"
            >
              ‹
            </button>

            <button
              onClick={handleNext}
              className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-blue-500 text-white w-8 h-8 rounded-full shadow hover:bg-blue-600"
            >
              ›
            </button>

            {/* ✅ Pagination Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {notifications.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === currentIndex ? "bg-blue-500" : "bg-gray-300"
                    }`}
                ></span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>

  )
}
