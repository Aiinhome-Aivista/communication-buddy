import React, { useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import ReportTable from '../../ui/ReportTable'
import Pagination from '../../ui/Pagination'
import { Paginate } from '../../../utils/Paginate';
import { Plus, Search } from 'lucide-react';
import AddScheduleModal from '../../ui/AddScheduleModal';

function ManageSchedule() {
    const headers = ["Sl. No.", "Candidate Name","Email","Session Date","Session Time", "Session Topic"];
    const keys = ["id", "candidate_name", "hr_name","id", "candidate_name", "hr_name"];
    const [candidateData, setCandidateData] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
                defaultRole={{ id: 2, name: "Candidate" }}   
            // onSave={handleSaveCandidate}
            />
        </div>
        
    )
}

export default ManageSchedule
