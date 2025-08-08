import React, { useState, useEffect } from 'react'
import { FaFileExport } from 'react-icons/fa'
import ReportTable from '../../ui/ReportTable'
import Pagination from '../../ui/Pagination'
import { Paginate } from '../../../utils/Paginate';
import { Plus, Search } from 'lucide-react';
import AddUserModal from '../../ui/AddUserModal';
import { fatchedGetRequest, fatchedPostRequest, getURL, postURL } from '../../../services/ApiService';
import { getDate } from '../../../utils/Timer';

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
    useEffect(() => {
        if (userRole === "hr") {
            fetchUserData();
        }
    }, []);
    const fetchUserData = async () => {
        try {
            const response = await fatchedGetRequest(getURL.GetAllUser);
            if (response.Success === true || response.status === 200) {
                const processed = (response.data || []).map((session) => ({
                    ...session,
                    dob: getDate(session.dob),
                }));
                setHrData(processed);
            }

        } catch (error) {
            console.error('Error fetching Data', error.message);

        }
    }
    return (
        <div className="text-teal-100 p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-300">Manage User</h1>
                {/* Add Icon + Search + Export */}
                <div className="flex items-center space-x-3">
                    {/* Search Field */}
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
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={paginate}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            <AddUserModal
                isOpen={showModal}
                title="Add New User"
                onClose={handleCloseModal}
                defaultRole={{ id: 1, name: "HR" }}
            // onSave={handleSaveCandidate}
            />
        </div>
    )
}

export default ManageUser
