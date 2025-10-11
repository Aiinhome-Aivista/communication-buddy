import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fatchedPostRequest, postURL } from "../../../services/ApiService";
import { useContext } from "react";

const tabOptions = ["Upcoming", "Ongoing", "Expired"];

export default function PracticeTest() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState("Test Type");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allTopics, setAllTopics] = useState([]); // New state to store topics from getAllTopics API
  const [testTypeOptions, setTestTypeOptions] = useState(["All"]); // Initialize with "All"
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  // setUserData is not defined in this component, so I'm assuming it comes from a context.
  // If not, you might need to import and use the correct context provider.
  // const { setUserData } = useContext(UserContext); 

  // Function to call the getAllTopics API
  useEffect(() => {
    const fetchAllTopics = async () => {
      try {
        const payload = { "user_id": userId }; // Specific payload as requested
        console.log("Fetching all topics with payload:", payload);
        const response = await fatchedPostRequest(postURL.getAllTopics, payload);
        console.log("getAllTopics response:", response);
        if (response && response.topics) {
          setAllTopics(response.topics);

          // Extract unique topic categories from the API response
          const categories = ["All", ...new Set(response.topics.map((topic) => topic.topic_category))];
          setTestTypeOptions(categories);

          // Set default test type to the first category if available
          if (categories.length > 0) {
            setTestType(categories[0]);
          }

        }
      } catch (error) {
        console.error("Error fetching all topics:", error);
      }
    };
    fetchAllTopics();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to handle the animation when filters change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Duration of the animation
    return () => clearTimeout(timer);
  }, [activeTab, search, testType]);

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


  const filteredData = allTopics
    .filter((topic) => {
      // Tab filtering logic
      const status = topic.topic_attend_status?.toLowerCase();
      const tab = activeTab.toLowerCase();

      if (tab === "upcoming") {
        // Assuming 'assigned' status means it's an upcoming test
        return status === "upcoming";
      }
      return status === tab;
    })
    .filter((topic) =>
      // Search filtering logic
      [topic.topic_name, topic.topic_category, topic.hr_name].some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter((topic) =>
      // Test Type filtering logic
      testType === "All" ||
      topic.topic_category?.toLowerCase() === testType.toLowerCase()

    );

  // Helper to get status styles
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
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
    const status = rowData.topic_attend_status;
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
          <h1 className="text-2xl font-bold text-[#2C2E42]">
            Practice & Test
          </h1>

          {/* Tabs + Search + Dropdown */}
          <div className="flex flex-row items-center mt-6 space-x-4 gap-3">
            <div className="flex border border-[#BCC7D2] rounded-xl overflow-hidden h-10">
              {tabOptions.map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-2 text-sm text-semibold rounded-xl font-medium cursor-pointer ${activeTab === tab
                    ? "bg-[#FEFEFE] text-[#2C2E42]"
                    : "bg-[#ECEFF2] text-[#8F96A9]"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search content"
                className="w-full h-10 px-6 border border-[#BCC7D2] rounded-xl text-[#8F96A9] text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#ECEFF2] pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8F96A9] cursor-default"
                sx={{ fontSize: "1.25rem" }}
              />
            </div>
            {/* Test type */}
            <div className="relative ml-auto" ref={dropdownRef}>
              <button
                className="border border-[#BCC7D2] rounded-xl px-8 text-sm bg-[#ECEFF2] flex items-center justify-between w-80 h-10"
                style={{ color: "#8F96A9" }}
              >

                {testType}
                {dropdownOpen ? (
                  <KeyboardArrowUpIcon className="w-4 h-4 text-[#8F96A9] cursor-pointer"
                    onClick={() => setDropdownOpen(false)} />
                ) : (
                  <KeyboardArrowDownIcon className="w-4 h-4 text-[#8F96A9] cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)} />
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
            <div key={`${activeTab}-${search}-${testType}`}>
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
                  field="topic_name"
                  header="Test Title"
                  body={(rowData) => (
                    <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                      {rowData.topic_name}
                    </span>
                  )}
                ></Column>
                <Column
                  field="hr_name"
                  header="Assigned by"
                  body={(rowData) => (
                    <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                      {rowData.hr_name}
                    </span>
                  )}
                ></Column>
                <Column
                  field="session_date"
                  header="Session Date"
                  body={(rowData) => {
                    if (!rowData.session_time) return "";
                    const date = new Date(rowData.session_time);
                    return date.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
                  }}
                ></Column>
                <Column
                  field="session_time"
                  header="Session Time"
                  body={(rowData) => {
                    if (!rowData.session_time) return "";
                    const date = new Date(rowData.session_time);
                    return date.toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    });
                  }}
                ></Column>
                <Column
                  field="total_time"
                  header="Session Duration"
                  body={(rowData) => `${rowData.total_time} mins`}
                ></Column>
                <Column
                  field="topic_attend_status"
                  header="Status"
                  body={statusBodyTemplate}
                  className="text-center"
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
