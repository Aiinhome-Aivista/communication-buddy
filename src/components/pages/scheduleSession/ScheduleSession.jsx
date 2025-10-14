import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { fatchedPostRequest, postURL } from '../../../services/ApiService';
import { getDate, getTime } from '../../../utils/Timer';
import { useContext } from "react";
import SessionModal from "../../modal/SessionModal";
import SuccessModal from "./SuccessModal";
import LoaderNew from "../../ui/LoaderNew";
import { useMinLoaderTime } from "../../../hooks/useMinLoaderTime";

const tabOptions = ["Upcoming", "Ongoing", "Expired"];

export default function ScheduleSession() {
    const [topics, setTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [userData, setUserData] = useState([]);
    const [sessionData, setSessionData] = useState([])
    const userId = parseInt(sessionStorage.getItem("user_id"), 10);
    const userRole = sessionStorage.getItem("userRole");
    const [loading, setLoading] = useState(true); // Full page loader
    const [loadingTable, setLoadingTable] = useState(false); // Table refresh loader
    const [rotation, setRotation] = useState(false);
    const [activeTab, setActiveTab] = useState("Upcoming");
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
    const [modalState, setModalState] = useState({
        date: "",
        sessionTopic: "",
        candidateName: "",
        sessionCategory: "",
        candidateSearch: "",
    });

    const showLoader = useMinLoaderTime(loading || loadingTable, 3000);

    // setUserData is not defined in this component, so I'm assuming it comes from a context.
    // If not, you might need to import and use the correct context provider.
    // const { setUserData } = useContext(UserContext); 

    // Function to call the getAllTopics API
    const fetchUserData = async () => {
        try {
            const JsonBody = { "hr_id": userId };
            const response = await fatchedPostRequest(postURL.hrTopicCandidate, JsonBody);
            if (response.success === true || response.status === 200) {
                setUserData(response.candidates);
                setTopics(response.topics);
                setCategories(response.distinct_topic_category);
            }
        } catch (error) {
            console.error('Error fetching Data', error.message);
        }
    };

    const fetchSessionData = async () => {
        try {
            const JsonBody = { "p_user_id": userId };
            const response = await fatchedPostRequest(postURL.getScheduleDataHrWise, JsonBody);
            if (response.message === "Success" || response.Success === true) {
                const processed = (response.data || []).map((session) => ({
                    ...session,
                    session_date: getDate(session.session_time),
                    session_time: getTime(session.session_time),
                }));
                setSessionData(processed);

                // Extract unique topic categories from the new session data
                const categories = ["All", ...new Set(processed.map((session) => session.topic_category).filter(Boolean))];
                setTestTypeOptions(categories);

            }
        } catch (error) {
            console.error('Error fetching Data', error.message);
        }
    };

    const handleSaveSchedule = async (scheduleData) => {
        try {
            setLoadingTable(true);
            let response;

            // If the modal explicitly marked this payload as an edit, only call update
            if (scheduleData && scheduleData.__isEdit) {
                const payload = { ...scheduleData };
                delete payload.__isEdit; // remove internal flag before sending

                if (!payload.id) {
                    alert('Update failed: missing record id');
                    return;
                }

                response = await fatchedPostRequest(postURL.updateUserTopic, payload);
                if (response && (response.success === true || response.status === 200 || String(response.message || '').toLowerCase().includes('updated'))) {
                    alert('Update successful');
                    await fetchSessionData();
                } else {
                    alert('Update failed');
                }
            } else {
                // Insert new schedule
                response = await fatchedPostRequest(postURL.insertUserTopic, scheduleData);
                if (response && (response.message === "request updated" || response.success === true || response.status === 200)) {
                    await fetchSessionData();   // new data refresh
                }
            }
        } catch (error) {
            console.error("Error inserting schedule:", error);
        } finally {
            setLoadingTable(false);
        }
    };

    // Handler when Edit is clicked on a row
    const handleEdit = async (row) => {
        try {
            setLoadingTable(true);
            // Expect row to contain either user_topic_id (preferred) or id
            const id = row.user_topic_id || row.id || row.user_topic_id_raw || row.id_raw;
            if (!id) {
                alert('Cannot edit: missing id');
                return;
            }

            // Backend expects { user_topic_id: <id> } for get-user-topic-by-id in many cases
            const payload = row.user_topic_id ? { user_topic_id: id } : { id };
            const response = await fatchedPostRequest(postURL.getUserTopicById, payload);
            if (response && response.topic) {
                const topic = response.topic;
                // Map response to modal initial fields
                const initialData = {
                    user_id: topic.user_id,
                    id: topic.user_topic_id || topic.id,
                    hr_id: topic.hr_id,
                    topic: topic.topic,
                    topic_category: topic.topic_category,
                    assign_datetime: topic.assign_datetime, // keep raw string (could be RFC string)
                    total_time: topic.total_time,
                };

                setEditingSchedule(initialData);
                setIsEditMode(true);
                setShowModal(true);
            } else {
                alert('Failed to fetch schedule details');
            }
        } catch (err) {
            console.error('Error fetching schedule by id', err.message);
        } finally {
            setLoadingTable(false);
        }
    };

    // Handler for delete
    const handleDelete = async (row) => {
        try {
            if (!confirm('Are you sure you want to delete this schedule?')) return;
            setLoadingTable(true);
            const id = row.id || row.id;
            if (!id) return alert('Missing id to delete');
            const payload = { id };
            const response = await fatchedPostRequest(postURL.deleteUserTopic, payload);
            if (response && (response.success === true || response.status === 200 || response.message === 'Deleted')) {
                await fetchSessionData();
            } else {
                alert('Failed to delete schedule');
            }
        } catch (err) {
            console.error('Delete error', err.message);
        } finally {
            setLoadingTable(false);
        }
    };

    // Initial data load
    useEffect(() => {
        if (userRole === 'hr') {
            const loadData = async () => {
                setLoading(true);
                await fetchUserData();
                await fetchSessionData();
                setLoading(false);
            };
            loadData();
        }
    }, [userRole]);

    // Reload data (sync button)
    const ReloadGridData = async () => {
        try {
            setRotation(true);
            setLoadingTable(true);
            await fetchUserData();
            await fetchSessionData();
        } catch (error) {
            console.error('Error reloading data:', error.message);
        } finally {
            setLoadingTable(false);
            setTimeout(() => setRotation(false), 500);
        }
    };

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

    const filteredData = sessionData
        .filter((session) => {
            // Tab filtering logic
            const status = session.topic_attend_status?.toLowerCase();
            const tab = activeTab.toLowerCase();

            if (tab === "upcoming") {
                // Assuming 'assigned' status means it's an upcoming test
                return status === "assigned" || status === "upcoming";
            }
            return status === tab;
        })
        .filter((session) =>
            // Search filtering logic
            [session.candidate_name, session.topic, session.topic_category].some((value) =>
                value?.toString().toLowerCase().includes(search.toLowerCase())
            )
        )
        .filter((session) =>
            // Test Type filtering logic
            testType === "All" ||
            session.topic_category?.toLowerCase() === testType.toLowerCase()

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
                {status || 'N/A'}
            </span>
        );
    };

    // Custom template for the empty message
    const emptyMessageTemplate = (
        <div className="flex flex-col items-center justify-center p-5 text-center text-gray-500">
            {loading || loadingTable ? (
                <p>Loading sessions...</p>
            ) : (
                <>
                    <InfoOutlinedIcon sx={{ fontSize: "3rem", color: "#BCC7D2" }} />
                    <p className="mt-4 text-lg">No data found</p>
                    <p className="text-sm text-gray-400">
                        There are no sessions matching your criteria.
                    </p>
                </>
            )}
        </div>
    );

    return (
        <div className="w-full min-h-full bg-[#ECEFF2] flex flex-col">
            <div className="flex-grow flex flex-col">
                <div className="pt-4 px-4">
                    <div className="flex justify-between items-start px-0 mx-0">
                        <h1 className="text-2xl font-bold text-[#2C2E42]">
                            Schedule Session
                        </h1>
                        <button
                            className="flex items-center gap-2 bg-[#E5B800] hover:bg-yellow-500 text-xs text-[#272727] font-semibold px-4 py-2 rounded-xl shadow-none cursor-pointer"
                            onClick={() => setModalOpen(true)}
                        >
                            <svg
                                className="w-5 h-5"
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

                    {/* Tabs + Search + Dropdown */}
                    <div className="flex flex-row items-center mt-6 space-x-4 gap-3">
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
                                className="border border-[#BCC7D2] rounded-xl px-8 text-sm bg-[#ECEFF2] flex items-center justify-between w-80 h-10 cursor-pointer"
                                style={{ color: "#8F96A9" }}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >

                                {testType}
                                {dropdownOpen ? (
                                    <KeyboardArrowUpIcon className="w-4 h-4 text-[#8F96A9]"/>
                                ) : (
                                    <KeyboardArrowDownIcon className="w-4 h-4 text-[#8F96A9] "/>
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
                        <div
                            className={`relative text-center border border-[#BCC7D2] rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${loading || loadingTable || rotation ? 'bg-gray-200' : ''}`}
                            onClick={ReloadGridData}
                        >
                            <AutorenewRoundedIcon className={`w-5 h-5 ${loading || loadingTable || rotation ? 'animate-spin text-[#2C2E42]' : 'text-[#8F96A9]'}`}
                                sx={{
                                    transition: "color 0.2s ease-in-out",
                                    "&:hover": {
                                        color: "#2C2E42", // Darker color on hover
                                    },
                                }} />
                        </div>
                    </div>

                    {/*DataTable */}
                    {showLoader ? (
                        <LoaderNew />
                    ) : (
                        <div className={`table-body custom-width-table transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            <div key={`${activeTab}-${search}-${testType}`}>
                                <DataTable
                                    value={filteredData}
                                    paginator
                                    rows={5}
                                    rowsPerPageOptions={[3, 5]}
                                    paginatorClassName="!m-0"
                                    rowHover={filteredData.length > 0}
                                    emptyMessage={emptyMessageTemplate}
                                >
                                    <Column
                                        field="candidate_name"
                                        header="Candidate Name"
                                        body={(rowData) => (
                                            <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                                                {rowData.candidate_name}
                                            </span>
                                        )}
                                    ></Column>
                                    <Column
                                        field="topic"
                                        header="Topic"
                                    ></Column>
                                    <Column
                                        field="session_time"
                                        header="Session Date"
                                        body={(rowData) => rowData.session_date}
                                    ></Column>
                                    <Column
                                        field="session_time"
                                        header="Session Time"
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
            <SessionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                sessionDuration={sessionDuration}
                setSessionDuration={setSessionDuration}
                modalState={modalState}
                setModalState={setModalState}
                userData={userData}
                topics={topics}
                onSave={() => {
                    setModalOpen(false);
                    setSuccessOpen(true);
                    fetchSessionData(); // Refresh the data in the table
                    // Reset modal state after successful save
                    setModalState({
                        date: "",
                        sessionTopic: "",
                        candidateName: "",
                        sessionCategory: "",
                        candidateSearch: "",
                    });
                }}
            />
            <SuccessModal
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
            // candidateName={candidateName}
            />
        </div>
    );
}
