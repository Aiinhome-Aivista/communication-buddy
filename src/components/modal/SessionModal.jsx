import React, { useState, useEffect } from "react";
import SuccessModal from "./SessionModal";
import { fatchedPostRequest, postURL } from "../../services/ApiService";

export default function SessionModal({
  open,
  onClose,
  sessionDuration,
  setSessionDuration,
  onSave,
  userData = [],
  topics = [],
}) {
  if (!open) return null;

  useEffect(() => {
    console.log("Topics data in SessionModal:", topics);
  }, [topics]);

  const [date, setDate] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [sessionCategory, setSessionCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);

  const uniqueCategories = [
    ...new Set(topics.map((topic) => topic.topic_category).filter(Boolean)),
  ];
  
  const [candidateSearch, setCandidateSearch] = useState("");

const filteredCandidates = userData.filter(
  (candidate) =>
    candidate.name_email &&
    candidate.name_email.toLowerCase().includes(candidateSearch.toLowerCase())
);

  // ✅ Helper function to clear a specific field’s error
  const clearError = (field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!candidateName) newErrors.candidateName = "Candidate Name should not be empty.";
    if (!date) newErrors.date = "Date should not be empty.";
    if (!sessionCategory)
      newErrors.sessionCategory = "Session category is required.";
    if (!sessionTopic.trim())
      newErrors.sessionTopic = "Session topic is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      user_id: candidateName, // Assuming candidateName holds ID
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

  const handleReset = () => {
    setDate("");
    setSessionTopic("");
    setCandidateName("");
    setSessionCategory("");
    setSessionDuration({ value: 15, direction: "up" });
    setErrors({});
  };

  const handleInputChange = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val)) return;
    if (val < 5) val = 5;
    if (val > 50) val = 50;

    setSessionDuration({
      value: val,
      direction: val > sessionDuration.value ? "up" : "down",
    });
  };

  return (
    <>
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        candidateName={candidateName}
        isSuccess={true}
      />

      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
        <div className="bg-white rounded-2xl w-[50%] max-w-full h-[90%] max-h-full flex flex-col shadow-2xl overflow-hidden">
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
                <label className="block text-[#182938] font-medium mb-3 text-base">
                  Candidate Name
                    <span className="text-red-500 mr-1"> *</span>
                </label>
                <div className="relative">
                  <select
                    className={`cursor-pointer w-full border rounded-xl px-4 py-3 text-sm bg-white appearance-none h-[48px] focus:outline-none ${
                      errors.candidateName
                        ? "border-red-500"
                        : "border-[#E5E7EB] focus:ring-2 focus:ring-[#E5B800]"
                    } text-[#BCC7D2]`}
                    value={candidateName}
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      if (e.target.value) clearError("candidateName");
                    }}
                  >
                    <option value="">Select candidate</option>
                    {userData.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.name_email}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none overflow-y-auto scrollbar-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.candidateName && (
                  <p className="text-red-500 text-sm mt-1 overflow-y-auto scrollbar-none">
                    {errors.candidateName}
                  </p>
                )}
              </div>

              {/* Session Date */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-base">
                  Session Date Time
                  <span className="text-red-500 mr-1"> *</span>
                </label>
                <div className="w-full cursor-pointer">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (e.target.value) clearError("date");
                    }}
                    className={`w-full border rounded-xl px-4 py-3 text-sm bg-white h-[48px] focus:outline-none cursor-text ${
                      errors.date
                        ? "border-red-500"
                        : "border-[#E5E7EB] focus:ring-2 focus:ring-[#E5B800]"
                    } text-[#1F2937]`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              {/* Session Category */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-base">
                  Session Category
                  <span className="text-red-500 mr-1"> *</span>
                </label>
                <div className="relative">
                  <select
                    className={`cursor-pointer w-full border rounded-xl px-4 py-3 text-sm bg-white appearance-none h-[48px] focus:outline-none ${
                      errors.sessionCategory
                        ? "border-red-500"
                        : "border-[#E5E7EB] focus:ring-2 focus:ring-[#E5B800]"
                    } text-[#BCC7D2]`}
                    value={sessionCategory}
                    onChange={(e) => {
                      setSessionCategory(e.target.value);
                      if (e.target.value) clearError("sessionCategory");
                    }}
                  >
                    <option value="">Select category</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.sessionCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sessionCategory}
                  </p>
                )}
              </div>

              {/* Session Duration */}
              <div>
                <label className="block text-[#182938] font-medium mb-3 text-base">
                  Session Duration
                  <span className="text-red-500 mr-1"> *</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* Editable Input */}
                  <div className="w-[80px] h-[48px] border border-[#E5E7EB] rounded-xl flex items-center justify-center bg-white">
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={sessionDuration?.value ?? 15}
                      onChange={handleInputChange}
                      className="text-[#BCC7D2] font-medium text-base w-full text-center outline-none bg-transparent"
                    />
                  </div>

                  {/* Range Slider */}
                  <div className="flex-1 relative flex flex-col items-stretch">
                    <div className="relative">
                      <input
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
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, rgba(41, 50, 65, 0.45) 0%, rgba(41, 50, 65, 0.45) ${
                            ((sessionDuration?.value ?? 15) - 5) / 45 * 100
                          }%, rgba(41, 50, 65, 0.05) ${
                            ((sessionDuration?.value ?? 15) - 5) / 45 * 100
                          }%, rgba(41, 50, 65, 0.05) 100%)`,
                        }}
                      />
                      <div
                        className="absolute -top-8 text-[#3D5B81] text-xs px-2 py-5 rounded"
                        style={{
                          left: `calc(${
                            ((sessionDuration?.value ?? 15) - 5) / 45 * 100
                          }% - 12px)`,
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
              <label className="block text-[#182938] font-medium mb-3 text-base">
                Session Topic
                <span className="text-red-500 mr-1"> *</span>
              </label>
              <textarea
                value={sessionTopic}
                onChange={(e) => {
                  setSessionTopic(e.target.value);
                  if (e.target.value.trim()) clearError("sessionTopic");
                }}
                placeholder="Write session topic..."
                rows="4"
                className={`w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#E5B800] focus:outline-none resize-none text-sm placeholder:text-[#9CA3AF] ${
                  errors.sessionTopic
                    ? "border-red-500"
                    : "border-[#E5E7EB]"
                } text-[#BCC7D2]`}
              />
              {errors.sessionTopic && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sessionTopic}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E7EB] px-8 py-4 flex justify-between bg-white mt-auto rounded-b-2xl">
            <button
              type="button"
              className="cursor-pointer border-2 border-[#E5B800] text-[#1F2937] font-semibold px-8 py-2.5 rounded-xl bg-transparent hover:bg-yellow-50 transition"
              onClick={handleReset}
            >
              Reset
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                className="cursor-pointer border-2 border-[#E5B800] text-[#1F2937] font-semibold px-8 py-2.5 rounded-xl bg-transparent hover:bg-yellow-50 transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cursor-pointer bg-[#E5B800] hover:bg-[#D4A700] text-[#1F2937] font-semibold px-8 py-2.5 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
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
