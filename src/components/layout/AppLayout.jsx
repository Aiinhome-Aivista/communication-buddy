import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import LeftSidebar from '../ui/LeftSidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}