import React from 'react'
import Sidebar from '../../ui/Sidebar'
import NewDashboard from './NewDashboard';
import ScheduleSessionDashboard from './ScheduleSessionDashboard';
export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          <Sidebar />
          {/* <NewDashboard /> */}
          <ScheduleSessionDashboard />
        </div>
      </section>
    </>
  );
}
