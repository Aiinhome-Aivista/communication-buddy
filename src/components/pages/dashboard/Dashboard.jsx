import React from 'react'
import Sidebar from '../../ui/Sidebar'
import NewDashboard from './NewDashboard';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          <NewDashboard />
        </div>
      </section>
    </>
  );
}
