import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react"; 

export default function AddUserModal({ isOpen, title, onClose, defaultRole }) {
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleEmailChange = (e) => setEmail(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1b6a65] rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] p-6 relative border border-gray-200 overflow-y-auto">  
                {/* ⬆️ width বাড়ানো হলো (max-w-2xl) */}

                {/* Title + Close */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <X onClick={onClose} className="cursor-pointer text-white hover:text-gray-200" size={22} />
                </div>

                {/* Form Fields */}
                <div className="mt-4 space-y-4 bg-white/10 p-3 rounded-md">
                    
                    {/* Row 1: Name + Email */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">Name</label>
                            <input type="text" placeholder="Enter Name" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">Email</label>
                            <input 
                                type="email" 
                                placeholder="Enter Gmail" 
                                value={email}
                                onChange={handleEmailChange}
                                pattern=".+@gmail\.com" 
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" 
                                title="Only @gmail.com is allowed" 
                            />
                        </div>
                    </div>

                    {/* Row 2: Password + Phone */}
                    <div className="flex gap-3">
                        <div className="w-1/2 relative">
                            <label className="block text-sm font-medium text-white mb-1">Password</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter Password" 
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 pr-10" 
                            />
                            {/* 👁 Eye Icon */}
                            {showPassword ? (
                                <EyeOff 
                                    size={20} 
                                    className="absolute right-3 top-9 text-gray-600 cursor-pointer" 
                                    onClick={togglePasswordVisibility} 
                                />
                            ) : (
                                <Eye 
                                    size={20} 
                                    className="absolute right-3 top-9 text-gray-600 cursor-pointer" 
                                    onClick={togglePasswordVisibility} 
                                />
                            )}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">Phone</label>
                            <input type="number" placeholder="Enter Phone" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                    </div>

                    {/* Row 3: DOB + User Type */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">DOB</label>
                            <input type="date" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-white mb-1">User Type</label>
                            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300">
                                <option className="bg-[#134e4a] text-white">Select</option>
                                <option className="bg-[#134e4a] text-white">HR</option>
                                <option className="bg-[#134e4a] text-white">Candidate</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500">Cancel</button>
                    <button className="px-4 py-2 rounded-lg bg-teal-800 text-white hover:bg-teal-500">Add</button>
                </div>
            </div>
        </div>
    );
}
