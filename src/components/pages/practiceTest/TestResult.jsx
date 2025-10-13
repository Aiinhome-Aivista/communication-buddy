import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fatchedPostRequest, postURL } from '../../../services/ApiService';
import { getDate, getTime } from '../../../utils/Timer';
import { useContext } from "react";

export default function TestResult() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [userData, setUserData] = useState([]);
  const [sessionData, setSessionData] = useState([])
  const userRole = sessionStorage.getItem("userRole");
  const [loading, setLoading] = useState(false); // Full page loader
  const [loadingTable, setLoadingTable] = useState(false); // Table refresh loader
  const [rotation, setRotation] = useState(false);
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allTopics, setAllTopics] = useState([]); // New state to store topics from getAllTopics API
  const [testTypeOptions, setTestTypeOptions] = useState(["All"]); // Initialize with "All"
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState({ value: 15, direction: "up" });
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  // setUserData is not defined in this component, so I'm assuming it comes from a context.
  // If not, you might need to import and use the correct context provider.
  // const { setUserData } = useContext(UserContext); 

  // Fetch session results data
  useEffect(() => {
    const fetchTestResults = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const payload = { hr_id: userId };
        const response = await fatchedPostRequest(postURL.hrSessions, payload);
        console.log("API Response:", response);
        if (response && response.sessions) {
          const processedData = (response.sessions || []).map((session) => ({
            ...session,
            session_date: getDate(session.session_time),
            session_time: getTime(session.session_time),
          }));
          setSessionData(processedData);

          // Extract unique statuses for the dropdown filter
          const statuses = ["All", ...new Set(processedData.map(session => session.status).filter(Boolean))];
          setTestTypeOptions(statuses);
          if (statuses.length > 0) setTestType(statuses[0]);
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestResults();
  }, [userId]);

  // Effect to handle the animation when filters change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Duration of the animation
    return () => clearTimeout(timer);
  }, [search, testType]);

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const filteredData = sessionData
    .filter((session) =>
      // Search filtering logic
      [session.username, session.topic, session.status].some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter((session) =>
      // Test Type filtering logic
      testType === "All" ||
      session.status?.toLowerCase() === testType.toLowerCase()

    );

  // Helper to get status styles
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "assigned": // Map 'assigned' to the 'upcoming' style
      case "upcoming":
        return "bg-blue-100 text-blue-600"; // Blue for upcoming
      case "ongoing":
        return "bg-[#35FF021A] text-[#46BA2F]"; // Green for ongoing
      case "expired":
        return "bg-red-100 text-red-600"; // Red for expired
      default:
        return "bg-gray-100 text-gray-500"; // Default/fallback style
    }
  };

  // Custom template for status badge
  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(status)}`}>
        {status}
      </span>
    );
  };

  // Custom template for the empty message
  const emptyMessageTemplate = (
    <div className="flex flex-col items-center justify-center p-5 text-center">
      <InfoOutlinedIcon sx={{ fontSize: "3rem", color: "#BCC7D2" }} />
      <p className="mt-4 text-lg text-gray-500">No data found</p>
      <p className="text-sm text-gray-400">There are no tests matching your criteria.</p>
    </div>
  );

  return (
    <div className="w-full min-h-full bg-[#ECEFF2] flex flex-col">
      <div className="flex-grow flex flex-col">
        <div className="pt-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#2C2E42]">Test Results</h1>
          </div>

          {/* Tabs + Search + Dropdown */}
          <div className="flex flex-row items-center justify-end mt-6 gap-4">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search content"
                className="w-full h-10 pl-10 pr-4 border border-[#BCC7D2] rounded-xl text-[#8F96A9] text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#ECEFF2]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8F96A9] cursor-default"
                sx={{ fontSize: "1.25rem" }}
              />
            </div>
            {/* Test type */}
            <div className="relative w-80" ref={dropdownRef}>
              <button
                className="border border-[#BCC7D2] rounded-xl px-4 text-sm bg-[#ECEFF2] flex items-center justify-between w-full h-10"
                style={{ color: "#8F96A9" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >

                {testType}
                {dropdownOpen ? (
                  <KeyboardArrowUpIcon className="w-4 h-4 text-[#8F96A9] cursor-pointer"
                  />
                ) : (
                  <KeyboardArrowDownIcon className="w-4 h-4 text-[#8F96A9] cursor-pointer"
                  />
                )}

              </button>
              {dropdownOpen && (
                <ul className="absolute mt-1 left-0 w-80 bg-[#BCC7D2] rounded-xl shadow-md z-10 overflow-hidden">
                  {testTypeOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setTestType(option);
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-2 text-base cursor-pointer font-medium text-[#182938] ${testType === option
                        ? "bg-[#D9D9D9] font-bold" // Selected: has background, no hover effect
                        : "hover:bg-[#D9D9D9]/50" // Not selected: has hover effect
                        }`}
                    >
                      {option}
                      {testType === option && (
                        <CheckIcon sx={{ fontSize: "1.25rem", color: "#182938" }} />
                      )}
                    </li>
                  ))}

                </ul>
              )}
            </div>
          </div>

          {/*DataTable */}
          <div className={`table-body custom-width-table transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div key={`${search}-${testType}`}>
              <DataTable
                value={filteredData}
                paginator
                rows={5}
                rowsPerPageOptions={[3, 5]}
                paginatorClassName="!m-0 !border-t"
                rowHover={filteredData.length > 0}
                emptyMessage={emptyMessageTemplate}
              >
                <Column
                  field="username"
                  header="Candidate Name"
                  body={(rowData) => (
                    <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                      {rowData.username}
                    </span>
                  )}
                ></Column>
                <Column
                  field="topic"
                  header="Topic"
                  sortable
                ></Column>
                <Column
                  field="session_date"
                  header="Session Date"
                  sortable
                ></Column>
                <Column
                  field="session_time"
                  header="Session Time"
                  sortable
                ></Column>
                <Column
                  field="score"
                  header="Score"
                  sortable
                  body={(rowData) => `${rowData.score || 'N/A'}`}
                ></Column>
                <Column
                  field="qualitative_score"
                  header="Qualitative Score"
                  sortable
                  body={(rowData) => `${rowData.qualitative_score || 'N/A'}`}
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
