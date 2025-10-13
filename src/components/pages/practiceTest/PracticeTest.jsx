import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fatchedPostRequest, postURL } from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import ExpiredModal from "../../../components/modal/ExpiredModal";
import UpcomingModal from "../../../components/modal/UpcomingModal";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import LoaderNew from "../../ui/LoaderNew";

const tabOptions = ["Upcoming", "Ongoing", "Expired"];

export default function PracticeTest() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState("Test Type");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allTopics, setAllTopics] = useState([]);
  const [testTypeOptions, setTestTypeOptions] = useState(["All"]);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  const [selectedTestItem, setSelectedTestItem] = useState(null);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();

  // ✅ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestTitle, setSelectedTestTitle] = useState("");

  const fetchAllTopics = async () => {
    setLoading(true);
    try {
      const payload = { user_id: userId };
      const response = await fatchedPostRequest(postURL.getAllTopics, payload);
      if (response && response.topics) {
        setAllTopics(response.topics);
        const categories = [
          "All",
          ...new Set(response.topics.map((topic) => topic.topic_category)),
        ];
        setTestTypeOptions(categories);
        if (categories.length > 0) setTestType(categories[0]);
      }
    } catch (error) {
      console.error("Error fetching all topics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics
  useEffect(() => {
    fetchAllTopics();
  }, [userId]);

  // Filter animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab, search, testType]);

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredData = allTopics
    .filter((topic) => {
      const status = topic.topic_attend_status?.toLowerCase();
      const tab = activeTab.toLowerCase();
      if (tab === "upcoming") return status === "upcoming";
      return status === tab;
    })
    .filter((topic) =>
      [topic.topic_name, topic.topic_category, topic.hr_name].some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter(
      (topic) =>
        testType === "All" ||
        topic.topic_category?.toLowerCase() === testType.toLowerCase()
    );

  // Status badge
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "ongoing":
        return "bg-[#35FF021A] text-[#46BA2F]";
      case "expired":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.topic_attend_status;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(
          status
        )}`}
      >
        {status}
      </span>
    );
  };

  // Empty message
  const emptyMessageTemplate = (
    <div className="flex flex-col items-center justify-center p-5 text-center">
      {loading ? (
        <p>Loading tests...</p>
      ) : (
        <>
          <InfoOutlinedIcon sx={{ fontSize: "3rem", color: "#BCC7D2" }} />
          <p className="mt-4 text-lg text-gray-500">No data found</p>
          <p className="text-sm text-gray-400">
            There are no tests matching your criteria.
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-full bg-[#ECEFF2] flex flex-col">
      <div className="flex-grow flex flex-col">
        <div className="pt-4 px-4">
          <h1 className="text-2xl font-bold text-[#2C2E42]">Practice & Test</h1>

          {/* Tabs + Search + Dropdown */}
          <div className="flex flex-row items-center mt-6 space-x-4 gap-3">
            {/* Tabs */}
            <div className="flex border border-[#BCC7D2] rounded-xl overflow-hidden h-10">
              {tabOptions.map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-2 text-sm rounded-xl cursor-pointer ${activeTab === tab
                    ? "bg-[#FEFEFE] text-[#2C2E42] font-bold"
                    : "bg-[#ECEFF2] text-[#8F96A9]"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search content"
                className="w-full h-10 px-6 border border-[#BCC7D2] rounded-xl text-[#8F96A9] text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#ECEFF2] pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8F96A9]"
                sx={{ fontSize: "1.25rem" }}
              />
            </div>

            {/* Dropdown */}
            <div className="relative ml-auto" ref={dropdownRef}>
              <button
                className="border border-[#BCC7D2] rounded-xl px-8 text-sm bg-[#ECEFF2] flex items-center justify-between w-80 h-10 cursor-pointer"
                style={{ color: "#8F96A9" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {testType}
                {dropdownOpen ? (
                  <KeyboardArrowUpIcon className="w-4 h-4 text-[#8F96A9]" />
                ) : (
                  <KeyboardArrowDownIcon className="w-4 h-4 text-[#8F96A9]" />
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
                        ? "bg-[#D9D9D9] font-bold"
                        : "hover:bg-[#D9D9D9]/50"
                        }`}
                    >
                      {option}
                      {testType === option && (
                        <CheckIcon
                          sx={{ fontSize: "1.25rem", color: "#182938" }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              className={`relative text-center border border-[#BCC7D2] rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${loading ? 'bg-gray-200' : ''}`}
              onClick={fetchAllTopics}
            >
              <AutorenewRoundedIcon className={`w-5 h-5 ${loading ? 'animate-spin text-[#2C2E42]' : 'text-[#8F96A9]'}`}
                sx={{
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "#2C2E42", // Darker color on hover
                  },
                }} />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <LoaderNew />
          ) : (
            <div
              className={`table-body custom-width-table transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
            >
              <div key={`${activeTab}-${search}-${testType}`}>
                <DataTable
                  value={filteredData}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[3, 5]}
                  paginatorClassName="!m-0 !border-t"
                  rowHover={filteredData.length > 0}
                  emptyMessage={emptyMessageTemplate}
                  onRowClick={(e) => {
                    const status = e.data.topic_attend_status?.toLowerCase();
                    if (status === "ongoing") {
                      navigate("/test/chat", {
                        state: {
                          topic: e.data.topic_name,
                          topic_name: e.data.topic_name,
                          hr_id: e.data.hr_id,
                          hr_name: e.data.hr_name,
                          assigned_by: e.data.hr_name,
                          user_id: e.data.user_id,
                          status: e.data.topic_attend_status,
                        },
                      });
                    } else if (status === "expired") {
                      setSelectedTestTitle(e.data.topic_name);
                      setIsModalOpen(true);
                    } else if (status === "upcoming") {
                      setSelectedTestItem(e.data);
                      setIsUpcomingModalOpen(true);
                    }


                  }}
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
                      return date.toLocaleDateString("en-GB");
                    }}
                  ></Column>
                  <Column
                    field="session_time"
                    header="Session Time"
                    body={(rowData) => {
                      if (!rowData.session_time) return "N/A";
                      return new Date(rowData.session_time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
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
          )}
        </div>
      </div>

      {/* ✅ Expired Modal */}
      <ExpiredModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTestTitle={selectedTestTitle}
      />

      <UpcomingModal
        isOpen={isUpcomingModalOpen}
        onClose={() => setIsUpcomingModalOpen(false)}
        selectedTestItem={selectedTestItem}
      />

    </div>
  );
}
