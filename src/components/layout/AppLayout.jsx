import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../ui/Header'
import Sidebar from '../ui/Sidebar'
import Footer from '../ui/Footer'
import Toaster from '../modal/Toaster'

export default function AppLayout() {
  return (
    <>
      <Toaster />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
