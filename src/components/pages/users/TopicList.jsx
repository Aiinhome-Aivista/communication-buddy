import React, { useState, useEffect } from 'react'
import { useTopic } from '../../../provider/TopicProvider'
import Pagination from '../../ui/Pagination';
import ReportTable from '../../ui/ReportTable';
import { FaFileExport } from 'react-icons/fa';
import { Paginate } from '../../../utils/Paginate';
import ConfirmModal from '../../ui/ConfirmModal';
import { fatchedPostRequest, postURL } from '../../../services/ApiService';

function TopicList() {
  const { getTopicData,handleTopic } = useTopic();
  const [filteredTopics, setFilteredTopics] = useState([]);
  // modal states
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
  const handleRaiseRequest = async (rowData) => {
    setSelectedTopic(rowData);
    setConfirmModal(true);
  };
  const confirmRequest = async () => {
    if (!selectedTopic) return;

    try {
      const requestBody = {
        user_id: selectedTopic.user_id,
        hr_id: selectedTopic.hr_id,
        topic: selectedTopic.topic_name
      };

      const response = await fatchedPostRequest(postURL.requestTopic, requestBody);

      if (response.status === 200 || response.success === true) {
        await handleTopic({ user_id: selectedTopic.user_id });
      } else {
      }
    } catch (error) {
      console.error('Failed to handle Raise Request:', error);
    }

    setConfirmModal(false);
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
        raiseRequest={handleRaiseRequest}
        keys={keys}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={paginate}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={confirmRequest}
        message={`Do you want to request "${selectedTopic?.topic_name}"?`}
      />
    </div>
  );
}

export default TopicList
