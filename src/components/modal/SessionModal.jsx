import React, { useState, useEffect, useRef, useCallback } from "react";
import SuccessModal from "./SessionModal";
import { fatchedPostRequest, postURL } from "../../services/ApiService";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import "../style/SessionModal.css";


export default function SessionModal({
  open,
  onClose,
  sessionDuration,
  setSessionDuration,
  modalState,
  setModalState,
  onSave,
  userData = [],
  topics = [],
}) {
  if (!open) return null;

  useEffect(() => {
    console.log("Topics data in SessionModal:", topics);
  }, [topics]);

  const { date, sessionTopic, candidateName, sessionCategory, candidateSearch } = modalState;

  const setDate = (newDate) => setModalState(prev => ({ ...prev, date: newDate }));
  const setSessionTopic = (newTopic) => setModalState(prev => ({ ...prev, sessionTopic: newTopic }));
  const setCandidateName = (newName) => setModalState(prev => ({ ...prev, candidateName: newName }));
  const setSessionCategory = (newCategory) => setModalState(prev => ({ ...prev, sessionCategory: newCategory }));
  const setCandidateSearch = (newSearch) => setModalState(prev => ({ ...prev, candidateSearch: newSearch }));


  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [candidateDropdownOpen, setCandidateDropdownOpen] = useState(false);
  const candidateDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const dateInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const uniqueCategories = [
    ...new Set(topics.map((topic) => topic.topic_category).filter(Boolean)),
  ];

  const filteredCandidates = userData.filter(
    (candidate) =>
      candidate.name_email &&
      candidate.name_email.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const handleReset = useCallback(() => {
    setDate("");
    setSessionTopic("");
    setCandidateName("");
    setSessionCategory("");
    setSessionDuration({ value: 15, direction: "up" });
    setErrors({});
    setCandidateSearch(""); // This will now update the parent state
  }, [setSessionDuration]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (
        candidateDropdownRef.current &&
        !candidateDropdownRef.current.contains(event.target)
      ) {
        setCandidateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryDropdownRef]);

  const clearError = (field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!candidateName)
      newErrors.candidateName = "Candidate Name should not be empty.";
    if (!date) newErrors.date = "Date should not be empty.";
    if (!sessionCategory)
      newErrors.sessionCategory = "Session category is required.";
    if (!sessionTopic.trim())
      newErrors.sessionTopic = "Session topic is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toDatetimeLocalInput = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    // Adjust for timezone offset to display local time correctly in the input
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };
  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);

    const formatDateTime = (isoDate) => {
      if (!isoDate) return "";
      const d = new Date(isoDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const scheduleData = {
      user_id: candidateName,
      hr_id: userId,
      topic: sessionTopic,
      topic_category: sessionCategory,
      assign_datetime: formatDateTime(date),
      total_time: sessionDuration?.value ?? sessionDuration,
    };

    try {
      const response = await fatchedPostRequest(
        postURL.insertUserTopic,
        scheduleData
      );
      if (
        response &&
        (response.message === "request updated" ||
          response.success === true ||
          response.status === 200)
      ) {
        onSave(scheduleData);
      } else {
        alert("Failed to create schedule.");
      }
    } catch (error) {
      console.error("Error inserting schedule:", error);
      alert("An error occurred while creating the schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  // Editable Input: Remove up/down arrows and allow only direct typing
  const handleInputChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) val = 5;
    val = Number(val);
    if (val < 5) val = 5;
    if (val > 50) val = 50;
    setSessionDuration({
      value: val,
      direction: "up",
    });
  };

  const handleIndicatorMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleIndicatorMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const sliderWidth = slider.offsetWidth;

    let newValue = (offsetX / sliderWidth) * 45 + 5; // (max - min) + min

    // Snap to the nearest 5-minute interval
    newValue = Math.round(newValue / 5) * 5;

    // Clamp the value between 5 and 50
    if (newValue < 5) newValue = 5;
    if (newValue > 50) newValue = 50;

    setSessionDuration({
      value: newValue,
      direction: "up",
    });
  };

  const handleIndicatorMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleIndicatorMouseMove);
      window.addEventListener("mouseup", handleIndicatorMouseUp);
    } else {
      window.removeEventListener("mousemove", handleIndicatorMouseMove);
      window.removeEventListener("mouseup", handleIndicatorMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleIndicatorMouseMove);
      window.removeEventListener("mouseup", handleIndicatorMouseUp);
    };
  }, [isDragging, handleIndicatorMouseMove, handleIndicatorMouseUp]);




  return (
    <>
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        candidateName={candidateName}
        isSuccess={true}
      />

      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-full flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#E5E7EB] px-8 py-4 flex items-center">
            <button
              onClick={onClose}
              className="mr-4 text-[#2C2E42] hover:text-[#E5B800]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-[#1F2937]">
              Add new schedule
            </h2>
          </div>

          {/* Form Content */}
          <div className="px-8 py-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {/* Candidate Name */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-sm">
                  Candidate Name
                  <span className="text-[#FF4D01] mr-1"> *</span>
                </label>
                <div className="relative" ref={candidateDropdownRef}>
                  <input
                    type="text"
                    placeholder="Select or search for a candidate"
                    className={`candidate-search-input cursor-pointer w-full border rounded-xl px-4 text-sm bg-white h-[48px] focus:outline-none flex items-center justify-between text-left ${errors.candidateName
                      ? "border-[#FF4D01] input-error"
                      : candidateName ? "border-[#DFB916]" : "border-[#BCC7D2] focus:ring-2 focus:ring-[#E5B800]"
                      } ${candidateName ? "text-[#182938]" : (errors.candidateName ? "text-[#FF4D017D]" : "text-[#BCC7D2]")} font-normal text-xs`}
                    value={candidateDropdownOpen ? candidateSearch : (userData.find(c => c.id === candidateName)?.name_email || "")}
                    onFocus={() => setCandidateDropdownOpen(true)}
                    onChange={(e) => {
                      setCandidateSearch(e.target.value);
                      setCandidateDropdownOpen(true);
                    }}
                  />
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${errors.candidateName ? 'text-[#FF4D017D]' : 'text-[#9CA3AF]'}`}>
                    {candidateDropdownOpen ? <KeyboardArrowUpIcon className="w-5 h-5" /> : <KeyboardArrowDownIcon className="w-5 h-5" />}
                  </div>
                  {candidateDropdownOpen && (
                    <ul className="absolute mt-1 w-full bg-[#BCC7D2] rounded-xl shadow-lg z-20 overflow-hidden">
                      <div className="overflow-y-auto max-h-48 candidate-dropdown-scrollbar">
                        {filteredCandidates.map((candidate) => (
                          <li
                            key={candidate.id}
                            onClick={() => {
                              setCandidateName(candidate.id);
                              setCandidateDropdownOpen(false);
                              setCandidateSearch(""); // Clear search on selection
                              clearError("candidateName");
                            }}
                            className={`flex items-center justify-between px-4 py-2 text-base cursor-pointer font-medium text-[#182938] ${candidateName === candidate.id
                              ? "bg-[#D9D9D9] font-bold"
                              : "hover:bg-[#D9D9D9]/50"
                              }`}
                          >
                            {candidate.name_email}
                            {candidateName === candidate.id && (
                              <CheckIcon sx={{ fontSize: "1.25rem", color: "#182938" }} />
                            )}
                          </li>
                        ))}
                        {filteredCandidates.length === 0 && (
                          <li className="px-4 py-2 text-sm text-gray-500">No candidates found</li>
                        )}
                      </div>
                    </ul>
                  )}
                </div>
                {errors.candidateName && (
                  <p className="text-[#FF4D01] text-xs mt-1 overflow-y-auto scrollbar-none">
                    {errors.candidateName}
                  </p>
                )}
              </div>

              {/* Session Date */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-sm">
                  Session Date Time
                  <span className="text-[#FF4D01] mr-1"> *</span>
                </label>
                <div className="relative">
                  {!date && (
                    <span className={`absolute top-1/2 left-4 -translate-y-1/2 text-xs pointer-events-none z-10 ${errors.date ? 'date-error-placeholder' : 'text-[#BCC7D2]'}`}>
                      DD/MM/YYYY MM:HH
                    </span>
                  )}
                  <input
                    type="datetime-local"
                    id="session-datetime-picker"
                    value={toDatetimeLocalInput(date)}
                    onChange={(e) => {
                      const newDate = e.target.value ? new Date(e.target.value).toISOString() : "";
                      setDate(newDate);
                      if (newDate) clearError("date");
                    }}
                    className={`w-full border rounded-xl px-4 text-sm bg-white h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E5B800] ${date ? 'text-[#182938]' : 'text-transparent'} ${errors.date ? "border-[#FF4D01] date-error" : date ? "border-[#DFB916]" : "border-[#BCC7D2]"}`}
                  />
                  {errors.date && (
                    <p className="text-[#FF4D01] text-xs mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

                {/* Session Category */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-sm">
                  Session Category
                  <span className="text-[#FF4D01] mr-1"> *</span>
                </label>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    className={`cursor-pointer w-full border rounded-xl px-4 text-sm bg-white h-[48px] focus:outline-none flex items-center justify-between text-left ${errors.sessionCategory
                      ? "border-[#FF4D01] input-error"
                      : sessionCategory ? "border-[#DFB916]" : "border-[#BCC7D2] focus:ring-2 focus:ring-[#E5B800]"
                      } ${sessionCategory ? "text-[#182938]" : (errors.sessionCategory ? "text-[#FF4D017D]" : "text-[#BCC7D2]")} font-normal text-xs`}
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  >
                    {sessionCategory || "Select category"}
                    <div className={`${errors.sessionCategory ? 'text-[#FF4D017D]' : 'text-[#9CA3AF]'}`}>
                      {categoryDropdownOpen
                        ? <KeyboardArrowUpIcon className="w-5 h-5" />
                        : <KeyboardArrowDownIcon className="w-5 h-5" />}
                    </div>
                  </button>
                  {categoryDropdownOpen && (
                    <ul className="absolute mt-1 w-full bg-[#BCC7D2] rounded-xl shadow-lg z-10 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                      {uniqueCategories.map((category) => (
                        <li
                          key={category}
                          onClick={() => {
                            setSessionCategory(category);
                            setCategoryDropdownOpen(false);
                            clearError("sessionCategory");
                          }}
                          className={`flex items-center justify-between px-4 py-2 text-base cursor-pointer font-medium text-[#182938] ${sessionCategory === category
                            ? "bg-[#D9D9D9] font-bold"
                            : "hover:bg-[#D9D9D9]/50"
                            }`}
                        >
                          {category}
                          {sessionCategory === category && (
                            <CheckIcon sx={{ fontSize: "1.25rem", color: "#182938" }} />
                          )}
                        </li>
                      ))}
                      {uniqueCategories.length === 0 && (
                        <li
                          className="px-4 py-2 text-sm text-gray-500"
                        >
                          No categories found
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                {errors.sessionCategory && (
                  <p className="text-[#FF4D01] text-xs mt-1">
                    {errors.sessionCategory}
                  </p>
                )}
              </div>

              {/* Session Duration */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-sm">
                  Session Duration
                  <span className="text-[#FF4D01] mr-1"> *</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* Editable Input: Remove up/down arrows */}
                  <div className="w-[50px] h-[50px] border border-[#BCC7D2] rounded-xl flex items-center justify-center bg-white">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={sessionDuration?.value ?? 15}
                      onChange={handleInputChange}
                      className="text-[#BCC7D2] font-medium text-base w-full text-center outline-none bg-transparent"
                      style={{
                        MozAppearance: "textfield",
                        appearance: "textfield",
                      }}
                      onKeyDown={(e) => {
                        // Prevent up/down arrow keys
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {/* Smooth Range Slider */}
                  <div className="flex-1 relative flex flex-col items-stretch">
                    <div className="relative">
                      <input
                        ref={sliderRef}
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={sessionDuration?.value ?? 15}
                        onChange={(e) =>
                          setSessionDuration({
                            value: Number(e.target.value),
                            direction: "up",
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #29324173 0%, #29324173 ${(((sessionDuration?.value ?? 15) - 5) / 45) * 100
                            }%, #e5e7eb ${(((sessionDuration?.value ?? 15) - 5) / 45) * 100
                            }%, #e5e7eb 100%)`,
                          transition: "background 0.2s linear",
                        }}
                      />
                      <div
                        className="absolute -top-8 text-[#3D5B81] text-xs px-2 py-5 rounded cursor-grab"
                        onMouseDown={handleIndicatorMouseDown}
                        style={{
                          left: `calc(${(((sessionDuration?.value ?? 15) - 5) / 45) * 100
                            }% - 12px)`,
                          transition: "left 0.2s linear",
                        }}
                      >
                        {sessionDuration?.value ?? 15}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-[#9CA3AF]">5 min</span>
                      <span className="text-xs text-[#9CA3AF]">50 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Topic */}
            <div className="mt-3">
              <label className="block text-[#182938] font-medium mb-3 text-sm">
                Session Topic
                <span className="text-[#FF4D01] mr-1"> *</span>
              </label>
              <textarea
                value={sessionTopic}
                onChange={(e) => {
                  setSessionTopic(e.target.value);
                  if (e.target.value.trim()) clearError("sessionTopic");
                }}
                rows="6.5"
                placeholder="Write session topic..."
                className={`w-full border rounded-xl p-4 font-normal text-xs focus:outline-none focus:ring-2 focus:ring-[#E5B800] text-[#182938] session-topic-textarea ${errors.sessionTopic ? "border-[#FF4D01] textarea-error" : sessionTopic ? "border-[#DFB916]" : "border-[#BCC7D2]"}`}
              />
              {errors.sessionTopic && (
                <p className="text-[#FF4D01] text-xs mt-1">
                  {errors.sessionTopic}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E7EB] px-8 py-4 flex justify-between bg-white mt-auto rounded-b-2xl">
            <button
              type="button"
              className="h-10 border border-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition-colors"
              onClick={handleReset}
            >
              Reset
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                className="h-10 border border-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-10 border border-[#DFB916] bg-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition-colors"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Initiating..." : "Initiate"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e5b800;
          cursor: pointer;
          border: 6px solid rgba(61, 91, 129, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
