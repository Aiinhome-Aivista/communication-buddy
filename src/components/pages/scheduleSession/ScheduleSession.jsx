import React, { useState } from "react";
import SessionModal from "../../modal/SessionModal";

const testData = [
  { title: "Python", date: "17/10/2025", status: "Active" },
  { title: "SQL", date: "11/10/2025", status: "Active" },
  { title: "JAVA", date: "13/10/2025", status: "Active" },
];

const tabOptions = ["Upcoming", "Ongoing", "Expired"];
const testTypeOptions = ["All", "Technology", "Communication"];

export default function ScheduleSession() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState("Test Type");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15);

  return (
    <div className="w-[100%] h-[100%] bg-[#ECEFF2] flex flex-col relative">
      <div className="flex-grow flex flex-col pt-6 px-6">
        {/* Header section with button on right */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2C2E42]">
            Schedule Session
          </h1>
          <button
            className="flex items-center gap-2 bg-[#E5B800] hover:bg-yellow-500 text-[#272727] font-semibold px-8 py-2 rounded-xl shadow-none"
            onClick={() => setModalOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Session
          </button>
        </div>

        <div className="flex flex-row items-center mt-6 space-x-8 gap-4">
          <div className="flex border border-[#BCC7D2] rounded-xl overflow-hidden">
            {tabOptions.map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "bg-[#FEFEFE] text-[#2C2E42]"
                    : "bg-[#ECEFF2] text-[#8F96A9]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* <input
            type="text"
            placeholder="Search content"
            className="flex-1 px-6 py-2 border border-[#BCC7D2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}

          <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search content"
                className="w-full px-6 py-2 border border-[#BCC7D2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-[#ECEFF2] pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img
                src="public/assets/icons/search.svg"
                alt="Search"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
              />
            </div>
          <div className="relative ml-auto">
            <button
              className="border border-[#BCC7D2] rounded-xl px-8 py-2 text-sm bg-[#ECEFF2] flex items-center justify-between w-80"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {testType}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute mt-1 left-0 w-80 bg-[#BCC7D2] rounded-2xl shadow-md z-10">
            {testTypeOptions.map((option) => (
  <li
    key={option}
    onClick={() => {
      setTestType(option);
      setDropdownOpen(false);
    }}
    className={`px-4 py-2 text-sm cursor-pointer text-[#1A2530] rounded-xl
      ${
        testType === option
          ? "bg-[#BCC7D2] font-semibold"
          : "hover:bg-[#D9D9D9]"
      }
    `}
  >
    {option}
  </li>
))}

              </ul>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-[#FFFFFF] mt-6 rounded-xl shadow">
          <table className="w-full ">
            <thead>
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-[#3D5B81]">
                  Test Title
                </th>
                <th className="text-right text-xs font-medium text-[#3D5B81]">
                  Session Date
                </th>
                <th className="px-5 text-right text-xs font-medium text-[#3D5B81]">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {testData.map((test, idx) => (
                <tr key={test.title} className="hover:bg-gray-50">
                  <td className="px-2 py-4 text-sm text-[#3D5B81]">
                    {test.title}
                  </td>
                  <td className="px-2 py-4 text-sm text-right text-[#29324173]">
                    {test.date}
                  </td>
                  <td className="px-1 py-4 text-sm text-right ">
                    <span className="px-4 py-1 rounded-full text-xs text-right font-medium bg-green-100 text-[#46BA2F]">
                      {test.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionDuration={sessionDuration}
        setSessionDuration={setSessionDuration}
      />
    </div>
  );
}