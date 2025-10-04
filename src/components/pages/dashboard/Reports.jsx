import React, { useEffect, useState } from "react";
import Pagination from "../../ui/Pagination";
import ReportTable from "../../ui/ReportTable";
import { Paginate } from "../../../utils/Paginate";
import { getDate, getTime, formatTimeOnly } from "../../../utils/Timer";
import { FaRotate } from "react-icons/fa6";
import CustomTooltip from "../../ui/CustomTooltip";
import Loader from "../../ui/Loader";


export default function Reports() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(false); // Full page loader
  const [loadingTable, setLoadingTable] = useState(false); // Table refresh loader
  const [rotation, setRotation] = useState(false);
  const [error, setError] = useState(null);
const headers = [
  "Name",
  "Email",
  "Topic",
  "Session Date",
  "Session Time",
  "Session Duration",
  "Comparative Time",
  "Qualitative Score",
  "Session Joining Time",
  "Session Exit Time",
  "Session Status",
  "Score",
  "Session Insights"
];

const keys = [
  "username",
  "email",
  "topic",
  "session_date",
  "session_time",
  "total_time",
  "comparative_time_ratio",
  "qualitative_score",
  "session_join_time",
  "session_exit_time",
  "status",
  "score",
  "feedback"
];

  const hrId = sessionStorage.getItem("user_id");

  const { currentItems, totalPages } = Paginate(
    reportsData,
    currentPage,
    itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Common fetch function
  const fetchReports = async () => {
    const response = await fetch("http://122.163.121.176:3004/hr-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        "X-Custom-Referrer": window.location.href // full page URL
      },
    
      body: JSON.stringify({ hr_id: parseInt(hrId) }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return (data.sessions || []).map((session) => ({
      ...session,
      session_date: getDate(session.session_time),
      session_time: getTime(session.session_time),
      session_join_time: formatTimeOnly(session.session_join_time),
      session_exit_time: formatTimeOnly(session.session_exit_time),
    }));
  };

  // First load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const processed = await fetchReports();
        setReportsData(processed);
      } catch (err) {
        // setError("Failed to load reports. Please try again.");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync icon reload
  const ReloadGridData = async () => {
    try {
      setRotation(true);
      setLoadingTable(true);
      const processed = await fetchReports();
      setReportsData(processed);
    } catch (error) {
      console.error("Error fetching Data", error.message);
    } finally {
      setLoadingTable(false);
      setTimeout(() => setRotation(false), 500);
    }
  };

  return (
    <div className="text-teal-100 p-2">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-300 flex items-center">
          Reports Management </h1>
        <span className="inline-block w-4"></span> {/* Adds space between text and icon */}
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

      {/* Table and Pagination */}
      <ReportTable
        tableData={currentItems}
        headers={headers}
        isShowAction={false}
        isRaiseRequest={false}
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

      {/* Full page loader */}
      <Loader show={loading} />
    </div>
  );
}

