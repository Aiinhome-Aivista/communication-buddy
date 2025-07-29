import { X } from "lucide-react";
import React from "react";

export default function AddModal({ isOpen, title, onClose, defaultRole }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1b6a65] rounded-lg shadow-lg w-full max-w-md max-h-[90vh] p-6 relative border border-gray-200 overflow-y-auto">

                {/* 🔹 Title + Close Icon */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <X
                        onClick={onClose}
                        className="cursor-pointer text-white hover:text-gray-200"
                        size={22}
                    />
                </div>

                {/* 🔹 Modal Body with Labels */}
                <div className="mt-4 space-y-4 bg-white/10 p-3 rounded-md">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">
                            Role
                        </label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-not-allowed" disabled> 
                            <option className="bg-[#134e4a] text-white" value={defaultRole.id}>{defaultRole.name}</option>
                        </select>
                    </div>
                    {/* Topic Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">
                            Topic
                        </label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300">
                            <option className="bg-[#134e4a] text-white">Select Topic</option>
                            <option className="bg-[#134e4a] text-white">Onboarding</option>
                            <option className="bg-[#134e4a] text-white">Training</option>
                            <option className="bg-[#134e4a] text-white">Policy</option>
                        </select>
                    </div>
                </div>

                {/* 🔹 Action Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-teal-800 text-white hover:bg-teal-500">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
