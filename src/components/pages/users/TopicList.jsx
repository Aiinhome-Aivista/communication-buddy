import React, { useState, useEffect } from 'react'
import { useTopic } from '../../../provider/TopicProvider'
import Pagination from '../../ui/Pagination';
import ReportTable from '../../ui/ReportTable';
import { FaFileExport } from 'react-icons/fa';
import { Paginate } from '../../../utils/Paginate';

function TopicList() {
  const { getTopicData } = useTopic();
  const [filteredTopics, setFilteredTopics] = useState([]);

  //  useEffect to filter topics where status is null
  useEffect(() => {
    if (getTopicData && getTopicData.length > 0) {
      const onlyNullStatus = getTopicData.filter(topic => topic.status === null);
      // console.log("Filtered topics with status null:", onlyNullStatus);
      setFilteredTopics(onlyNullStatus);
    }
  }, [getTopicData]);
  const headers = ["ID", "HR Name", "Topic Name"];
  const keys = ["id", "hr_name", "topic_name"];
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Paginate the reports data
  const { currentItems, totalPages } = Paginate(
    filteredTopics,
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
        <h1 className="text-2xl font-bold text-teal-300">Request Topic</h1>
        <button
          onClick={handleExport}
          className="flex items-center bg-teal-700 hover:bg-teal-600 text-teal-100 py-2 px-4 rounded-lg transition-colors"
        >
          <FaFileExport className="mr-2" />
          Export to Excel
        </button>
      </div>

      <ReportTable
        tableData={currentItems}
        headers={headers}
        isRaiseRequest={true}
        raiseRequest={() => alert("Requesting topic...")}
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

export default TopicList
