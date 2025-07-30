import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Notification({ notifications, onAction, onClose, role }) {
    console.log('notifications', notifications, role)
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    const limitedNotifications = notifications.slice(0, 4);
    return (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg border z-50">
            <div className="p-4 border-b font-semibold text-slate-700">Notifications</div>
            {/*  HR NOTIFICATION UI */}
            {role === "hr" && (
                <ul className="max-h-80 overflow-y-auto divide-y">
                    {limitedNotifications
                        .map((n) => (
                            <li key={n.id} className="p-3 text-sm text-gray-800">
                                <div className="mb-2">
                                    <strong>{n.candidate_name}</strong> has requested for{" "}
                                    <strong>{n.topic_name}</strong>.
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-xs"
                                        onClick={() => onAction(n.id, "accepted")}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-xs"
                                        onClick={() => onAction(n.id, "declined")}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
            {/* CANDIDATE NOTIFICATION UI */}
            {role === "candidate" && (
                <ul className="max-h-80 overflow-y-auto divide-y">
                    {limitedNotifications
                        .filter((n) => n.status === "pending") // only pending notifications
                        .map((n) => (
                            <li key={n.id} className="p-3 text-sm text-gray-800">
                                <div className="text-sm text-teal-600">
                                    Your request for <strong>{n.topic_name}</strong> is currently{" "}
                                    <strong className="text-orange-500">{n.status}</strong>.
                                </div>
                            </li>
                        ))}
                </ul>
            )}
            {notifications.length > 5 && (
                <div className="p-2 text-center text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => { onClose(); navigate("/dashboard/notifications", { state: { notifications } }); }}>
                    View all
                </div>
            )}
        </div>
    );
}

