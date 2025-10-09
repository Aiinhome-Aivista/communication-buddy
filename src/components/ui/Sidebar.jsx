import { useState } from "react";
import { Info } from "lucide-react";
export default function Sidebar() {
  const [active, setActive] = useState("Practice & Test");
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    {
      name: "Practice & Test",
      icon: (
        <img
          src="public/assets/icons/assignment.svg"
          alt="Practice & Test"
          className="h-10 w-10"
        />
      ),
    },
    {
      name: "Test Result",
      icon: (
        <img
          src="public/assets/icons/bar_chart_4_bars.svg"
          alt="Test Result"
          className="h-10 w-10"
        />
      ),
    },
    {
      name: "Settings",
      icon: (
        <img
          src="public/assets/icons/settings.svg"
          alt="Settings"
          className="h-10 w-10"
        />
      ),
    },
  ];
  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } bg-[#FFFFFF] h-screen border-t border-[#BCC7D2] border-r border-b flex flex-col justify-between transition-all duration-200 overflow-hidden`}
    >
      <div>
        <div className={`flex items-center border-b border-[#BCC7D2] px-3 py-3 ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center space-x-3">
            <div>
                 <img
          src="public/assets/icons/Subtract.svg"
          alt="profile_logo"
          className="h-10 w-10"
        />
            </div>
            {!collapsed && <p className="font-medium text-gray-800">John Doe</p>}
          </div>
          <button
            className="text-gray-400 hover:text-gray-800 transition ml-2"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        {/* Menu */}
        <nav className="mt-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 w-full text-left px-6 py-2 text-sm font-medium transition-colors ${
                active === item.name
                  ? "bg-[#1E293B] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              {item.icon}
              {!collapsed && item.name}
            </button>
          ))}
        </nav>
      </div>
       <div className={`flex items-center border-t border-[#BCC7D2] px-3 py-3 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center space-x-3">
          <img
            src="public/assets/icons/info.svg"
            alt="Help Icon"
            className="h-10 w-10 opacity-60"
          />
          {!collapsed && (
            <span className="font-medium text-gray-800 text-sm">Help and FAQ</span>
          )}
        </div>
      </div>
    </aside>
  );
}
