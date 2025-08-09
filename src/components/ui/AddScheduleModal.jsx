import React, { useEffect, useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { selectedDateFormat } from "../../utils/Timer";

export default function AddScheduleModal({ isOpen, title, onClose, userData, topics = [], onSave, hrId, categories }) {
    const [selectedUser, setSelectedUser] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [sessionTime, setSessionTime] = useState("");
    const [topicList, setTopicList] = useState([]);
    const [searchTopic, setSearchTopic] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const suggestionRef = useRef(null);
    const userDropdownRef = useRef(null);
    const [sessionCategory, setSessionCategory] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const categoryDropdownRef = useRef(null);
    // ✅ Load topics
    useEffect(() => {
        if (topics?.length) setTopicList(topics.map(t => t.topic_name));
    }, [topics]);

    // ✅ Close dropdowns on outside click
    useEffect(() => {
        const closeDropdowns = (e) => {
            if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setShowUserDropdown(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener("mousedown", closeDropdowns);
        return () => document.removeEventListener("mousedown", closeDropdowns);
    }, []);
    useEffect(() => {
        const handleReset = () => resetForm();
        document.addEventListener("reset-add-schedule", handleReset);
        return () => document.removeEventListener("reset-add-schedule", handleReset);
    }, []);
    if (!isOpen) return null;

    // ✅ Candidate select (custom dropdown)
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setShowUserDropdown(false);
    };

    // ✅ Topic input handlers
    const handleTopicChange = (e) => {
        setSearchTopic(e.target.value);
        setShowSuggestions(true);
    };
    const handleSelectTopic = (t) => {
        setSearchTopic(t);
        setShowSuggestions(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const exists = topicList.some(t => t.toLowerCase() === searchTopic.toLowerCase());
            if (searchTopic && !exists) setTopicList(prev => [...prev, searchTopic]);
            setShowSuggestions(false);
        }
    };
    // Select category
    const handleSelectCategory = (category) => {
        setSessionCategory(category);
        setShowCategoryDropdown(false);
    };
    // ✅ Save
    const handleInitiate = () => {
        if (!selectedUser || !sessionDate || !sessionTime || !searchTopic || !sessionCategory) {
            alert("Please fill all fields");
            return;
        }
        onSave?.({
            user_id: selectedUser.id,
            assign_datetime: selectedDateFormat(sessionDate),
            total_time: Number(sessionTime),
            topic: searchTopic,
            hr_id: hrId,
            topic_category: sessionCategory,
        });
        resetForm();
        onClose();
    };

    // const filteredTopics = searchTopic
    //     ? topicList.filter(t => t.toLowerCase().includes(searchTopic.toLowerCase()))
    //     : topicList;
    const filteredTopics = sessionCategory
        ? topics
            .filter(t => t.topic_category === sessionCategory)
            .map(t => t.topic_name)
            .filter(name => name.toLowerCase().includes(searchTopic.toLowerCase()))
        : [];
    const resetForm = () => {
        setSelectedUser("");
        setSessionDate("");
        setSessionTime("");
        setSearchTopic("");
        setSessionCategory("");
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1b6a65] rounded-lg shadow-lg w-full max-w-2xl max-h-[98vh] p-8 relative border border-gray-200 ">

                {/* Title */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <X onClick={onClose} className="cursor-pointer text-white" size={24} />
                </div>

                {/* ✅ Candidate Custom Dropdown */}
                <label className="text-white text-sm">Candidate Name</label>
                <div ref={userDropdownRef} className="relative mb-3">
                    <div
                        className="w-full px-3 py-2 border rounded-lg text-white cursor-pointer relative flex justify-between items-center"
                        onClick={() => setShowUserDropdown(prev => !prev)}
                    >
                        <span>{selectedUser?.name_email || "Select Candidate"}</span>
                        <ChevronDown className={`transition-transform ${showUserDropdown ? "rotate-180" : ""}`} size={18} />
                    </div>

                    {showUserDropdown && (
                        <div className="absolute top-full left-0 w-full bg-teal-700 text-white border rounded shadow-lg max-h-[150px] overflow-y-auto z-10">
                            {userData.map((user) => (
                                <div
                                    key={user.id}
                                    onMouseDown={() => handleSelectUser(user)}
                                    className="p-2 hover:bg-teal-800 cursor-pointer"

                                >
                                    {user.name_email}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date & Time */}
                <div className="flex gap-3">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-white mb-1">Session Date & Time</label>
                        <input
                            type="datetime-local"
                            value={sessionDate}
                            onChange={(e) => setSessionDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-white mb-1">Session Duration</label>
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={sessionTime}
                            // onChange={(e) => setSessionTime(e.target.value)}
                            onChange={(e) => {
                                const value = e.target.value;
                                // ✅ Allow only numbers, max 2 digits, and restrict to 1–60
                                if (/^\d{0,2}$/.test(value) && (value === "" || (Number(value) >= 1 && Number(value) <= 60))) {
                                    setSessionTime(value);
                                }
                            }}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                    </div>
                </div>
                <label className="text-white text-sm mt-3 mb-1 block">Session Category</label>
                <div ref={categoryDropdownRef} className="relative mb-3">
                    <div
                        className="w-full px-3 py-2 border rounded-lg text-white cursor-pointer relative flex justify-between items-center"
                        onClick={() => setShowCategoryDropdown(prev => !prev)}
                    >
                        <span>{sessionCategory || "Select Category"}</span>
                        <ChevronDown className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} size={18} />
                    </div>

                    {showCategoryDropdown && (
                        <div className="absolute top-full left-0 w-full bg-teal-700 text-white border rounded shadow-lg max-h-[150px] overflow-y-auto z-10">
                            {categories.map((catObj, i) => (
                                <div
                                    key={i}
                                    onMouseDown={() => handleSelectCategory(catObj.topic_category)}
                                    className="p-2 hover:bg-teal-800 cursor-pointer"
                                >
                                    {catObj.topic_category}
                                </div>
                            ))}
                        </div>
                    )}

                </div>


                {/* ✅ Topic Search with Scrollable Dropdown */}
                <label className="text-white text-sm">Session Topic</label>
                <div ref={suggestionRef} className="relative w-full">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchTopic}
                            onChange={handleTopicChange}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                sessionCategory
                                    ? "Search or add topic..."
                                    : "Select category first"
                            }
                            className="w-full px-3 py-2 border rounded-lg mb-1 pr-8 cursor-pointer placeholder:text-white focus:placeholder:text-white text-white bg-transparent disabled:cursor-not-allowed"
                            onFocus={() => sessionCategory && setShowSuggestions(true)}
                            disabled={!sessionCategory} // 🔹 Disabled until category is selected
                        />

                        <ChevronDown
                            className={`absolute right-2 top-3 text-gray-300 cursor-pointer transition-transform ${showSuggestions ? "rotate-180" : ""}`}
                            size={18}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (sessionCategory) setShowSuggestions(prev => !prev);
                            }}
                        />
                    </div>

                    {showSuggestions && sessionCategory && (
                        <div className="absolute top-full left-0 bg-teal-700 text-white border rounded w-full max-h-[150px] overflow-y-auto shadow-lg z-50">
                            {filteredTopics.map((t, i) => (
                                <div key={i} onMouseDown={() => handleSelectTopic(t)}
                                    className="p-2 cursor-pointer hover:bg-teal-800">{t}</div>
                            ))}

                            {searchTopic && (
                                <div
                                    onMouseDown={() => {
                                        if (!filteredTopics.some(t => t.toLowerCase() === searchTopic.toLowerCase())) {
                                            setTopicList(prev => [...prev, searchTopic]);
                                        }
                                        handleSelectTopic(searchTopic);
                                    }}
                                    className="p-2 cursor-pointer bg-teal-600 hover:bg-teal-800 text-white font-semibold">
                                    ➕ Use "{searchTopic}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                    <button onClick={handleInitiate} className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800">Initiate</button>
                </div>
            </div>
        </div>
    );
}
