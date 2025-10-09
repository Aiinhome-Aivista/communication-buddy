import React from 'react'
import HrDashboard from './HrDashboard';
import ScheduleSession from '../scheduleSession/ScheduleSession';
import PracticeTest from '../practiceTest/PracticeTest';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
         {/*  <HrDashboard/> */}
          {/* <ScheduleSession/> */}
          <PracticeTest/>
        </div>
      </section>
    </>
  );
}
