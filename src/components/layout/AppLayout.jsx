import React from 'react'
import { Outlet } from 'react-router'
import NewHeader from '../ui/NewHeader'
import Footer from '../ui/Footer'

export default function AppLayout() {
  return (
    <>
      <div className="flex flex-col h-screen bg-slate-900">
        <NewHeader />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
