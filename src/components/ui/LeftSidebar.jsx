import React from 'react';
import { ClipboardList, BarChart2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeftSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-56'
        } bg-white border-r transition-all duration-300 flex flex-col`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      <div className="flex-1 p-3 space-y-3">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          <ClipboardList size={20} />
          {!collapsed && <span>Practice & Test</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <BarChart2 size={20} />
          {!collapsed && <span>Analytics</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}