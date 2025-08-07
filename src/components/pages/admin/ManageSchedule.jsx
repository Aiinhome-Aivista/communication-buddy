import React, { useEffect, useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import ReportTable from '../../ui/ReportTable'
import Pagination from '../../ui/Pagination'
import { Paginate } from '../../../utils/Paginate';
import { Plus, Search } from 'lucide-react';
import AddScheduleModal from '../../ui/AddScheduleModal';
import { fatchedPostRequest, postURL } from '../../../services/ApiService';

function ManageSchedule() {
    const headers = ["Sl. No.", "Candidate Name", "Email", "Session Date", "Session Time", "Comparative Time", "Qualitative Time", "Session Joining Time", "Session Exit Time", "Session Status", "Session Topic"];
    const keys = ["id", "candidate_name", "hr_name", "id", "candidate_name", "Comparative Time", "Qualitative Time", "Session Joining Time", "Session Exit Time", "Session Status","hr_name"];
    const [candidateData, setCandidateData] = useState([]);
    const [topics, setTopics] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState([
        // { id: 1, name: "John Doe" },
        // { id: 2, name: "Jane Smith" },
        // { id: 3, name: "Alice Johnson" },
        // { id: 4, name: "Bob Brown" },
    ]);
    const [sessionData, setSessionData] = useState([])
    const userId = parseInt(sessionStorage.getItem("user_id"), 10);
    const userRole = sessionStorage.getItem("userRole");

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Paginate the reports data
    const { currentItems, totalPages } = Paginate(
        candidateData,
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
            }
            const response = await fatchedPostRequest(postURL.insertUserTopic, JsonBody);
            if (response.message === "Success" || response.Success === true) {
                setSessionData(response.data);
            }

        } catch (error) {
            console.error('Error fetching Data', error.message);

        }
    }
    const handleSaveSchedule = async (scheduleData) => {
        try {
            const response = await fatchedPostRequest(postURL.insertUserTopic, scheduleData);

            if (response.message === "request updated" || response.success === true) {
                // setShowModal(false);  // modal close
                // setTimeout(() => document.dispatchEvent(new Event("reset-add-schedule")), 0);

                // fetchSessionData();   // new data refresh
            } else {
            }
        } catch (error) {
            console.error("Error inserting schedule:", error);
        }
    };

    return (
        <div className="text-teal-100 p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-300">Manage Schedule</h1>
                <div className="flex items-center space-x-3">
                    {/* <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300" />
                        <input
                            type="text"
                            placeholder="Search Candidate"
                            className="pl-10 pr-3 py-2 rounded-lg bg-teal-700 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div> */}
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
                isRaiseRequest={true}
                // raiseRequest={handleRaiseRequest}
                keys={keys}
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
        </div>

    )
}

export default ManageSchedule
