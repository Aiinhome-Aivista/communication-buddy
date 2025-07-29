import React, { useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import ReportTable from '../../ui/ReportTable'
import Pagination from '../../ui/Pagination'
import { Paginate } from '../../../utils/Paginate';
import { Plus, Search } from 'lucide-react';
import AddModal from '../../ui/AddModal';

function ManageCandidate() {
    const headers = ["Sl. No.", "Candidate Name", "HR Name"];
    const keys = ["id", "candidate_name", "hr_name"];
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
    const handleNewCandidate = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    return (
        <div className="text-teal-100 p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-300">Manage Candidate</h1>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300" />
                        <input
                            type="text"
                            placeholder="Search Candidate"
                            className="pl-10 pr-3 py-2 rounded-lg bg-teal-700 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                    <button
                        onClick={handleNewCandidate}
                        className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
                    >
                        <Plus className="mr-2" />
                        Add New Candidate
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
            <AddModal
                isOpen={showModal}
                title="Add New HR"
                onClose={handleCloseModal}
                defaultRole={{ id: 2, name: "Candidate" }}   
            // onSave={handleSaveCandidate}
            />
        </div>
        
    )
}

export default ManageCandidate
