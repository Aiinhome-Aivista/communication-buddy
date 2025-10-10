import { useState } from "react";
import { Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: (
        <img
          src="public/assets/icons/assignment.svg"
          alt="Dashboard"
          className="h-7 w-7"
        />
      ),
      path: "/dashboard"
    },
    {
      name: "Schedule Session",
      icon: (
        <img
          src="public/assets/icons/assignment.svg"
          alt="Schedule Session"
          className="h-7 w-7"
        />

      ),
      path: "/schedule"
    },
    {
      name: "Practice & Test",
      icon: (
        <img
          src="public/assets/icons/assignment.svg"
          alt="Practice & Test"
          className="h-7 w-7"
        />

      ),
      path: "/test"
    },
    {
      name: "Test Result",
      icon: (
        <img
          src="public/assets/icons/bar_chart_4_bars.svg"
          alt="Test Result"
          className="h-7 w-7"
        />

      ),
    },
    {
      name: "Settings",
      icon: (
        <img
          src="public/assets/icons/settings.svg"
          alt="Settings"
          className="h-7 w-7"
        />

      ),
    },
  ];
  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"
        } bg-white h-screen border-t border-[#BCC7D2] border-r border-b flex flex-col transition-all duration-200 overflow-hidden`}
    >
      <div className={`flex items-center border-b border-[#BCC7D2] h-[calc(9%)] ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="w-[calc(15%)]"></div>
        <div className="flex items-center w-[calc(70%)]">
          <div>
            <img
              src="public/assets/icons/Subtract.svg"
              alt="Aiinhome Logo"
              className="h-10 w-10"
            />
          </div>
          {!collapsed && <p className="font-medium text-gray-800">John Doe</p>}
        </div>
        <button
          className="text-gray-400 hover:text-gray-800 transition w-[calc(15%)]"
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
      <div className="h-[calc(81%)]">
        {/* Menu */}
        <nav className="mt-2 p-3">
          {menuItems.map((item) => (
            <Link to={item.path ? item.path : item.name.toLowerCase().replace(/ /g, "-")} key={item.name}>
              <button className={`flex items-center gap-2 w-full h-[50px] rounded-2xl px-3 py-0 text-sm font-medium transition-colors ${location.pathname === (item.path || item.name.toLowerCase().replace(/ /g, "-"))
                  ? "bg-[#1E293B] text-white"
                  : "text-gray-700 hover:bg-gray-100"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                {item.icon}
                {!collapsed && item.name}
              </button>
            </Link>
          ))}
        </nav>

      </div>
      <div className={`flex items-center border-t border-[#BCC7D2] px-3 h-[calc(10%)] ${collapsed ? "justify-center" : "justify-between"}`}>
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
