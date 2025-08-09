import React, { useEffect, useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import ReportTable from '../../ui/ReportTable'
import Pagination from '../../ui/Pagination'
import { Paginate } from '../../../utils/Paginate';
import { Plus, Search } from 'lucide-react';
import AddScheduleModal from '../../ui/AddScheduleModal';
import { fatchedPostRequest, postURL } from '../../../services/ApiService';
import { getDate, getTime } from '../../../utils/Timer';
import CustomTooltip from '../../ui/CustomTooltip';
import { FaRotate } from 'react-icons/fa6';
import Loader from '../../ui/Loader';

function ManageSchedule() {
    const headers = ["Candidate Name", "Email", "Session Date", "Session Time", "Status", "Session Topic"];
    const keys = ["candidate_name", "email", "session_date", "session_time", "status", "topic"];
    const [topics, setTopics] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState([]);
    const [sessionData, setSessionData] = useState([])
    const userId = parseInt(sessionStorage.getItem("user_id"), 10);
    const userRole = sessionStorage.getItem("userRole");
    const [loading, setLoading] = useState(false); // Full page loader
    const [loadingTable, setLoadingTable] = useState(false); // Table refresh loader
    const [rotation, setRotation] = useState(false);
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Paginate the reports data
    const { currentItems, totalPages } = Paginate(
        sessionData,
        currentPage,
        itemsPerPage
    );
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    const handleExport = () => {
        alert("Exporting to Excel...");
    };
    const handleNewSchedule = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    useEffect(() => {
        if (userRole === "hr") {
            fetchUserData();
            fetchSessionData();
        }
    }, []);
    const fetchUserData = async () => {
        try {
            const JsonBody = {
                "hr_id": userId
            }
            const response = await fatchedPostRequest(postURL.hrTopicCandidate, JsonBody);
            if (response.success === true || response.status === 200) {
                setUserData(response.candidates);
                setTopics(response.topics);
            }

        } catch (error) {
            console.error('Error fetching Data', error.message);

        }
    }
    const fetchSessionData = async () => {
        try {
            const JsonBody = {
                "p_user_id": userId
            }
            const response = await fatchedPostRequest(postURL.getScheduleDataHrWise, JsonBody);
            if (response.message === "Success" || response.Success === true) {
                const processed = (response.data || []).map((session) => ({
                    ...session,
                    session_date: getDate(session.session_time),
                    session_time: getTime(session.session_time),
                }));
                console.log("Processed Session Data:", processed);
                setSessionData(processed);
            }

        } catch (error) {
            console.error('Error fetching Data', error.message);

        }
    }
    const handleSaveSchedule = async (scheduleData) => {
        try {
            const response = await fatchedPostRequest(postURL.insertUserTopic, scheduleData);

            if (response.message === "request updated" || response.success === true) {
                fetchSessionData();   // new data refresh
            } else {
            }
        } catch (error) {
            console.error("Error inserting schedule:", error);
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
    return (
        <div className="text-teal-100 p-2">
            <div className="flex justify-between items-center mb-6">
                {/* Left side: Title + Sync */}
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-teal-300">Manage Schedule</h1>
                    <span className="inline-block w-4"></span>
                    <CustomTooltip content="Sync Data" type="reload">
                        <span
                            onClick={ReloadGridData}
                            className="sync-icon cursor-pointer align-middle"
                            style={{ position: "relative", top: "2px" }}
                        >
                            <FaRotate className={`${rotation ? "rotate" : ""}`} />
                        </span>
                    </CustomTooltip>
                </div>

                {/* Right side: Search + Add Button */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300" />
                        <input
                            type="text"
                            placeholder="Search User"
                            className="pl-10 pr-3 py-2 rounded-lg bg-teal-700 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <button
                        onClick={handleNewSchedule}
                        className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
                    >
                        <Plus className="mr-2" />
                        Add New SChedule
                    </button>
                </div>
            </div>
            <ReportTable
                tableData={currentItems}
                headers={headers}
                isShowAction={true}
                // raiseRequest={handleRaiseRequest}
                keys={keys}
                loadingTable={loadingTable}

            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={paginate}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
            <AddScheduleModal
                isOpen={showModal}
                title="Add New Schedule"
                onClose={handleCloseModal}
                userData={userData}
                topics={topics}
                hrId={userId}
                onSave={handleSaveSchedule}
            />
            {/* Full page loader */}
            <Loader show={loading} />
        </div>

    )
}

export default ManageSchedule
