import React, { useState } from 'react';

export default function Default() {
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("userRole");

  const requestData = {
    active: ["John Doe", "Sara Ali"],
    pending: ["Alice Johnson", "Bob Smith", "Carlos Ray"],
    rejected: ["Ravi Kumar", "Meena Singh", "Tom Lee", "Anna Liu"]
  };

  const [modalType, setModalType] = useState(null); // 'active' | 'pending' | 'rejected' | null

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <>
      <h1 className="text-2xl text-gray-400">Dashboard</h1>
      <p className="mt-2 text-teal-200">Welcome, {userName ? userName : 'User'} to your dashboard!</p>
      <br />

      {userRole === 'hr' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card
            title="Active Requests"
            count={requestData.active.length}
            borderColor="green"
            iconColor="green"
            onClick={() => openModal('active')}
          />
          <Card
            title="Pending Requests"
            count={requestData.pending.length}
            borderColor="yellow"
            iconColor="yellow"
            onClick={() => openModal('pending')}
          />
          <Card
            title="Rejected Requests"
            count={requestData.rejected.length}
            borderColor="red"
            iconColor="red"
            onClick={() => openModal('rejected')}
          />
        </div>
      )}

      {/* Simple Popup Modal without background */}
      {modalType && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white w-[90%] max-w-md rounded-lg shadow-xl p-6 z-50 border">
          <h2 className="text-xl font-bold mb-4 text-gray-800 capitalize">{modalType} Request List</h2>
          <ol className="list-decimal pl-5 mb-4 text-gray-700">
            {requestData[modalType].map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ol>
          <div className="text-center">
            <button
              onClick={closeModal}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Card({ title, count, borderColor, iconColor, onClick }) {
  const iconSVGs = {
    green: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    yellow: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    red: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${borderColor}-500 cursor-pointer hover:shadow-lg transition`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{count}</h3>
        </div>
        <div className={`bg-${iconColor}-100 p-3 rounded-full`}>
          {iconSVGs[iconColor]}
        </div>
      </div>
    </div>
  );
}