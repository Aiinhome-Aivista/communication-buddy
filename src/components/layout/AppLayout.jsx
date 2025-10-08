import React from 'react'
import { Outlet } from 'react-router'
// import Header from '../ui/Header'
import NewHeader from '../ui/NewHeader'
import Footer from '../ui/Footer'
import Sidebar from '../ui/Sidebar'

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header: full width */}
      <NewHeader />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: fixed width */}
        <Sidebar />

        {/* Main content + footer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main scrollable content */}
          <main className="flex-1 overflow-auto">
              <Outlet />
          </main>

          {/* Footer sticks at bottom of main content */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
