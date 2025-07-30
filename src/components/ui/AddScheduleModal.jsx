import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddScheduleModal({ isOpen, title, onClose }) {
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    const handleEmailChange = (e) => setEmail(e.target.value);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1b6a65] rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] p-6 relative border border-gray-200 overflow-y-auto">

                {/* Title + Close */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <X onClick={onClose} className="cursor-pointer text-white hover:text-gray-200" size={22} />
                </div>

                {/* Form Fields */}
                <div className="mt-4 space-y-4 bg-white/10 p-3 rounded-md">

                    {/* Row 1: Username Dropdown */}
                    <div className="flex gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-white mb-1">Candidate Name</label>
                            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300">
                                <option>Select User</option>
                                <option>User1</option>
                                <option>User2</option>
                                <option>User3</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Session Date (Calendar) + Session Time (Clock) */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">Session Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">Session Time</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                            />
                        </div>
                    </div>

                    {/* Row 3: User Topic Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">User Topic</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300">
                            <option>Select</option>
                            <option>Topic 1</option>
                            <option>Topic 2</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500">Cancel</button>
                    <button className="px-4 py-2 rounded-lg bg-teal-800 text-white hover:bg-teal-500">Initiate</button>
                </div>
            </div>
        </div>
    );
}
