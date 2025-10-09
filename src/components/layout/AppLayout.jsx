import React from 'react'
import { Outlet } from 'react-router'
// import Header from '../ui/Header'
// import NewHeader from '../ui/NewHeader'
import Footer from '../ui/Footer'

export default function AppLayout() {
  return (
    <>
      {/* <Header />
    <main className='main-app-container h-[calc(100vh-8rem)] bg-slate-900'>
        <Outlet />
    </main>
   <Footer /> */}
      <div className="flex flex-col min-h-screen bg-slate-900">
        {/* <Header /> */}
        {/* <NewHeader /> */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
