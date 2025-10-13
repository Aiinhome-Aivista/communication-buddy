import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { fatchedGetRequest, getURL } from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { getDate } from "../../../utils/Timer";
import LoaderNew from "../../ui/LoaderNew";
import { useMinLoaderTime } from "../../../hooks/useMinLoaderTime";


const tabOptions = ["Upcoming", "Ongoing", "Expired"];

export default function ManageUser() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [testType, setTestType] = useState("Test Type");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [testTypeOptions, setTestTypeOptions] = useState(["All"]);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  const [loading, setLoading] = useState(true);
  const showLoader = useMinLoaderTime(loading, 3000);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fatchedGetRequest(getURL.GetAllUser);
      if (response.Success === true || response.status === 200) {
        const processedData = (response.data || []).map((user) => ({
          ...user,
          dob: getDate(user.dob),
        }));
        setUserData(processedData);

        const userTypes = ["All", ...new Set(processedData.map(user => user.userType).filter(Boolean))];
        setTestTypeOptions(userTypes);
        if (userTypes.length > 0) setTestType(userTypes[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  // Filter animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [search, testType]);

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
  const filteredData = userData
    .filter((user) =>
      [user.name, user.email, user.phone_number, user.userType].some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter((user) =>
      testType === "All" ||
      user.userType?.toLowerCase() === testType.toLowerCase()
    );

  // Status badge
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "hr":
        return "bg-[#35FF021A] text-[#46BA2F]";
      case "candidate":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.userType;
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
        <p>Loading Users...</p>
      ) : (
        <>
          <InfoOutlinedIcon sx={{ fontSize: "3rem", color: "#BCC7D2" }} />
          <p className="mt-4 text-lg text-gray-500">No Users Found</p>
          <p className="text-sm text-gray-400">
            There are no users matching your criteria.
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-full bg-[#ECEFF2] flex flex-col">
      <div className="flex-grow flex flex-col">
        <div className="pt-4 px-4">
          <h1 className="text-2xl font-bold text-[#2C2E42]">Manage Users</h1>
          {/* Tabs + Search + Dropdown */}
          <div className="flex flex-row items-center justify-between mt-6 gap-4">
            {/* Search */}
            <div className="relative flex-1">
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

            {/* Dropdown */}
            <div className="relative w-80" ref={dropdownRef}>
              <button
                className="border border-[#BCC7D2] rounded-xl px-4 text-sm bg-[#ECEFF2] flex items-center justify-between w-full h-10 cursor-pointer"
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
              onClick={fetchUserData}
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
          {showLoader ? (
            <LoaderNew />
          ) : (
            <div
              className={`table-body custom-width-table transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
            >
              <div key={`${search}-${testType}`}>
                <DataTable
                  value={filteredData}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 7]}
                  paginatorClassName="!m-0"
                  rowHover={filteredData.length > 0}
                  emptyMessage={emptyMessageTemplate}
                >
                  <Column
                    field="name"
                    header="Name"
                    body={(rowData) => (
                      <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                        {rowData.name}
                      </span>
                    )}
                  ></Column>
                  <Column
                    field="email"
                    header="Email"
                    body={(rowData) => (
                      <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                        {rowData.email}
                      </span>
                    )}
                  ></Column>
                  <Column
                    field="phone_number"
                    header="Phone"
                  ></Column>
                  <Column
                    field="dob"
                    header="DOB"
                  ></Column>
                  <Column
                    field="userType"
                    header="User Type"
                    body={statusBodyTemplate}
                    className="text-center"
                  ></Column>
                </DataTable>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
