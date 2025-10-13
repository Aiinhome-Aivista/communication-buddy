import React from 'react';
import TestResult from './TestResult'; // HR view
import CandidateTestResult from './CandidateTestResult'; // Candidate view

export default function TestResultPage() {
    const userRole = sessionStorage.getItem("userRole")?.toLowerCase() || "candidate";

    // Render the appropriate component based on the user's role
    if (userRole === 'hr') {
        return <TestResult />;
    }

    // Default to the candidate view
    return <CandidateTestResult />;
}