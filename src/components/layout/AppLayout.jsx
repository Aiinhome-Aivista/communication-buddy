import React from 'react'
import { Outlet } from 'react-router'
import Header from '../ui/Header'
import Footer from '../ui/Footer'

export default function AppLayout() {
  return (
    <>
   <Header />
    <main className='main-app-container h-[calc(100vh-8rem)] bg-slate-900'>
        <Outlet />
    </main>
   <Footer />
    </>
  )
}
