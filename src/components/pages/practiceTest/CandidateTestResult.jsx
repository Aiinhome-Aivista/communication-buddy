import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fatchedPostRequest, postURL } from "../../../services/ApiService";
import { getDate, getTime } from "../../../utils/Timer";

export default function CandidateTestResult() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = parseInt(sessionStorage.getItem("user_id"), 10);

    useEffect(() => {
        const fetchResults = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // Assuming an endpoint exists to get results for a candidate
                const response = await fatchedPostRequest(postURL.getAllTopics, { user_id: userId });
                if (response && response.topics) {
                    const completedTests = response.topics
                        .filter(topic => topic.topic_attend_status?.toLowerCase() === 'completed')
                        .map(session => ({
                            ...session,
                            session_date: getDate(session.session_time),
                            session_time_formatted: getTime(session.session_time),
                        }));
                    setResults(completedTests);
                }
            } catch (error) {
                console.error("Error fetching test results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [userId]);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-600";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };

    const statusBodyTemplate = (rowData) => {
        const status = rowData.topic_attend_status;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(status)}`}>
                {status}
            </span>
        );
    };

    const emptyMessageTemplate = (
        <div className="flex flex-col items-center justify-center p-5 text-center">
            {loading ? (
                <p>Loading results...</p>
            ) : (
                <>
                    <InfoOutlinedIcon sx={{ fontSize: "3rem", color: "#BCC7D2" }} />
                    <p className="mt-4 text-lg text-gray-500">No Results Found</p>
                    <p className="text-sm text-gray-400">You have not completed any tests yet.</p>
                </>
            )}
        </div>
    );

    return (
        <div className="w-full min-h-full bg-[#ECEFF2] flex flex-col p-4">
            <h1 className="text-2xl font-bold text-[#2C2E42] mb-6">My Test Results</h1>
            <div className="table-body custom-width-table">
                <DataTable
                    value={results}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    loading={loading}
                    paginatorClassName="!m-0 !border-t"
                    rowHover={results.length > 0}
                    emptyMessage={emptyMessageTemplate}
                >
                    <Column
                        field="topic_name"
                        header="Test Title"
                        sortable
                        body={(rowData) => (
                            <span style={{ color: "#3D5B81", fontWeight: "400" }}>
                                {rowData.topic_name}
                            </span>
                        )}
                    />
                    <Column
                        field="hr_name"
                        header="Assigned By"
                        sortable
                    />
                    <Column
                        field="session_date"
                        header="Session Date"
                        sortable
                    />
                    <Column
                        field="score"
                        header="Score"
                        sortable
                        body={(rowData) => `${rowData.score || 'N/A'}`}
                    />
                    <Column
                        field="qualitative_score"
                        header="Qualitative Score"
                        sortable
                        body={(rowData) => `${rowData.qualitative_score || 'N/A'}`}
                    />
                    <Column
                        field="topic_attend_status"
                        header="Status"
                        body={statusBodyTemplate}
                    />
                </DataTable>
            </div>
        </div>
    );
}