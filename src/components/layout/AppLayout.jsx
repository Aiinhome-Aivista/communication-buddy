import React from 'react'
import { Outlet } from 'react-router-dom'
import NewHeader from '../ui/NewHeader'
import Sidebar from '../ui/Sidebar'
import Footer from '../ui/Footer'

export default function AppLayout() {
  return (
    <>
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <NewHeader />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
