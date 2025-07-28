import React, { useState } from "react";
import { FaFileExport } from "react-icons/fa";
import Pagination from "../../ui/Pagination";
import ReportTable from "../../ui/ReportTable";
import { Paginate } from "../../../utils/Paginate";

const reportsData = [
  { id: 1, name: "Monthly Sales", date: "2023-05-15", status: "Completed" },
  { id: 2, name: "User Activity", date: "2023-05-10", status: "Pending" },
  { id: 3, name: "Inventory", date: "2023-05-05", status: "Completed" },
  { id: 4, name: "Financial Summary", date: "2023-04-30", status: "Failed" },
  {
    id: 5,
    name: "Customer Feedback",
    date: "2023-04-25",
    status: "Completed",
  },
  { id: 6, name: "Quarterly Report", date: "2023-04-20", status: "Completed" },
  { id: 7, name: "Marketing Analysis", date: "2023-04-15", status: "Pending" },
  { id: 8, name: "Annual Review", date: "2023-04-10", status: "Failed" },
  {
    id: 9,
    name: "Product Performance",
    date: "2023-04-05",
    status: "Completed",
  },
  { id: 10, name: "Sales Forecast", date: "2023-03-30", status: "Pending" },
  {
    id: 11,
    name: "Website Analytics",
    date: "2023-03-25",
    status: "Completed",
  },
  {
    id: 12,
    name: "Employee Performance",
    date: "2023-03-20",
    status: "Completed",
  },
  { id: 13, name: "Budget Report", date: "2023-03-15", status: "Pending" },
  {
    id: 14,
    name: "Customer Acquisition",
    date: "2023-03-10",
    status: "Failed",
  },
  {
    id: 15,
    name: "Revenue Analysis",
    date: "2023-03-05",
    status: "Completed",
  },
];

const headers = ["ID", "Report Name", "Date", "Status", "Actions"];

export default function Reports() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Paginate the reports data
  const { currentItems, totalPages } = Paginate(
    reportsData,
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

  return (
    <div className="text-teal-100 p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-300">Reports Management</h1>
        <button
          onClick={handleExport}
          className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
        >
          <FaFileExport className="mr-2" />
          Export to Excel
        </button>
      </div>

      <ReportTable tableData={currentItems} headers={headers} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={paginate}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
