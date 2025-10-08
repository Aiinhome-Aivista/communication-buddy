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
    const headers = ["Candidate Name", "Email", "Session Date", "Session Time", "Session Topic", "Session Category", "Status",];
    const keys = ["candidate_name", "email", "session_date", "session_time", "topic", "topic_category", "status",];
    const [topics, setTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
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

    // State for search
    const [searchTerm, setSearchTerm] = useState("");

    // Filtered data based on search term
    const filteredData = sessionData.filter(item => {
        const term = searchTerm.toLowerCase();
        return (
            item.candidate_name?.toLowerCase().includes(term) ||
            item.email?.toLowerCase().includes(term) ||
            item.topic?.toLowerCase().includes(term) ||
            item.topic_category?.toLowerCase().includes(term)
        );
    });

    // Paginate the filtered data
    const { currentItems, totalPages } = Paginate(
        filteredData,
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
        setEditingSchedule(null);
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="pl-10 pr-3 py-2 rounded-lg bg-teal-700 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <button
                        onClick={handleNewSchedule}
                        className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
                    >
                        <Plus className="mr-2" />
                        Add New Schedule
                    </button>
                </div>
            </div>

            <ReportTable
                tableData={currentItems}
                headers={headers}
                isShowAction={true}
                keys={keys}
                loadingTable={loadingTable}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Gap between table and pagination */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={paginate}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>

            <AddScheduleModal
                isOpen={showModal}
                title="Add New Schedule"
                onClose={handleCloseModal}
                userData={userData}
                topics={topics}
                categories={categories}
                hrId={userId}
                onSave={handleSaveSchedule}
                initialData={editingSchedule}
                isEdit={isEditMode}
            />

            {/* Full page loader */}
            <Loader show={loading} />
        </div>
    )
}

export default ManageSchedule
