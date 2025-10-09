import React from 'react'
import NewDashboard from './NewDashboard';
import ScheduleSessionDashboard from './ScheduleSessionDashboard';
import HrDashboard from './HrDashboard';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          <NewDashboard />
          {/* <ScheduleSessionDashboard /> */}
          {/* <HrDashboard/> */}
        </div>
      </section>
    </>
  );
}
