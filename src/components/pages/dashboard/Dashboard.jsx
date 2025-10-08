import React from 'react'
import Sidebar from '../../ui/Sidebar'
//import AppSidebar from '../../ui/AppSidebar'
// import { Outlet } from 'react-router';
import NewDashboard from './NewDashboard';
// import NewDashboard from './NewDashboard';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          {/* <AppSidebar /> */}
          <Sidebar />
          {/* Main content area <outlet /> dynamic content change) */}
          {/* <div className="dashboard-content flex-1 w-[50%] p-4 bg-teal-500/5 m-1 rounded-md shadow-sm border-2 border-teal-500 backdrop-blur-sm">
            <Outlet />
          </div> */}
          <NewDashboard />
        </div>
      </section>
    </>
  );
}
