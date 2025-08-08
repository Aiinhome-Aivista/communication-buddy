import React, { use, useEffect, useState } from "react";
import { FaFileExport } from "react-icons/fa";
import Pagination from "../../ui/Pagination";
import ReportTable from "../../ui/ReportTable";
import { Paginate } from "../../../utils/Paginate";
import { getDate, getTime } from "../../../utils/Timer";
const headers = ["Name", "Email", "Topic", "Session Date", "Session Time", "Session Duration","Comparative Time", "Qualitative Time", "Session Joining Time", "Session Exit Time", "Session Status", "Score", "Session Insights"];
const keys = ["username", "email", "topic", "session_date", "session_time", "total_time", "comparative_time_ratio", "qualitative_score", "session_join_time", "session_exit_time", "status", "score", "feedback"];

export default function Reports() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reportsData, setReportsData] = useState([]);
  const hrId = sessionStorage.getItem("user_id");
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
  useEffect(() => {
    fetchReports();
  }, []);
  const fetchReports = async () => {
    try {
      const response = await fetch("http://122.163.121.176:3004/hr-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hr_id: parseInt(hrId)
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // setReportsData(data.sessions); 
      const processed = (data.sessions || []).map((session) => ({
        ...session,
        session_date: getDate(session.session_time),
        session_time: getTime(session.session_time),
      }));
      setReportsData(processed);
    } catch (err) {
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-teal-100 p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-300">Reports Management</h1>
        {/* <button
          onClick={handleExport}
          className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
        >
          <FaFileExport className="mr-2" />
          Export to Excel
        </button> */}
      </div>

      <ReportTable
        tableData={currentItems}
        headers={headers}
        isShowAction={false}
        isRaiseRequest={false}
        keys={keys}
      />

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
