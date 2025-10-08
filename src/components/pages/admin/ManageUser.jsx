import React, { useState, useEffect } from 'react'
import { FaFileExport } from 'react-icons/fa'
import ReportTable from '../../ui/ReportTable'
import Pagination from '../../ui/Pagination'
import { Paginate } from '../../../utils/Paginate';
import { Plus, Search } from 'lucide-react';
import AddUserModal from '../../ui/AddUserModal';
import { fatchedGetRequest, fatchedPostRequest, getURL, postURL } from '../../../services/ApiService';
import { getDate } from '../../../utils/Timer';
import CustomTooltip from '../../ui/CustomTooltip';
import { FaRotate } from 'react-icons/fa6';
import Loader from '../../ui/Loader';

function ManageUser() {
    const userId = parseInt(sessionStorage.getItem("user_id"), 10);
    const userRole = sessionStorage.getItem("userRole");
    const headers = ["Sl. No.", "Name", "Email", "Phone", "DOB", "User Type"];
    const keys = ["id", "name", "email", "phone_number", "dob", "userType"];

    const [hrData, setHrData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false); // Full page loader
    const [loadingTable, setLoadingTable] = useState(false); // Table refresh loader
    const [rotation, setRotation] = useState(false);
    // Paginate the reports data
    const { currentItems, totalPages } = Paginate(
        hrData,
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
    const handleNewHR = () => {
        // alert("Add New HR clicked!");
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    // useEffect(() => {
    //     if (userRole === "hr") {
    //         fetchUserData();
    //     }
    // }, []);

    // Fetch user data and return processed list
    const fetchUserData = async () => {
        try {
            const response = await fatchedGetRequest(getURL.GetAllUser);
            if (response.Success === true || response.status === 200) {
                return (response.data || []).map((session) => ({
                    ...session,
                    dob: getDate(session.dob),
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching Data', error.message);
            return [];
        }
    };

    // First load
    useEffect(() => {
        if (userRole === 'hr') {
            const loadData = async () => {
                setLoading(true);
                const processed = await fetchUserData();
                setHrData(processed);
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
            const processed = await fetchUserData();
            setHrData(processed);
        } catch (error) {
            console.error('Error fetching Data', error.message);
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
                    <h1 className="text-2xl font-bold text-teal-300">Manage User</h1>
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
                        onClick={handleNewHR}
                        className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
                    >
                        <Plus className="mr-2" />
                        Add New User
                    </button>
                </div>
            </div>

            <ReportTable
                tableData={currentItems}
                headers={headers}
                keys={keys}
                isShowAction={true}
                loadingTable={loadingTable}

            />
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={paginate}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>

            <AddUserModal
                isOpen={showModal}
                title="Add New User"
                onClose={handleCloseModal}
                defaultRole={{ id: 1, name: "HR" }}
            // onSave={handleSaveCandidate}
            />

            {/* Full page loader */}
            <Loader show={loading} />
        </div>
    )
}

export default ManageUser
