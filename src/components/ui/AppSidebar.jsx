import { Bell, BookOpenCheck, ChartColumnStacked, ChevronRight, LogOut, List  } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../provider/AuthProvider";

// static menu list
const menuList = [
  {
    icon: <Bell size={20} />,
    title: "Notifications",
    path: "/dashboard/notifications",
    allowedRoles: ["hr"]
  },
  {
    icon: <ChartColumnStacked size={20} />,
    title: "Reports & Review",
    path: "/dashboard/reports",
    allowedRoles: ["hr"]
  },
  {
    icon: <BookOpenCheck size={20} />,
    title: "Practice & Test",
    path: "/dashboard/test",
    allowedRoles: ["candidate"]
  },
  {
    icon: <List  size={20} />,
    title: "Topics",
    path: "/dashboard/topics",
    allowedRoles: ["candidate"]
  },
];

export default function AppSidebar() {
  const { logout  } = useAuth();
  
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  // Get role directly from sessionStorage
  const userRole = sessionStorage.getItem("userRole") || "";

  // Filter menu items based on role
  const filteredMenu = menuList.filter(item =>
    item.allowedRoles.includes(userRole.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <div
      className={`sidebar ${
        collapsed ? "w-20" : "w-64"
      } bg-slate-800 text-white h-[calc(100vh-8rem)] border-r-4 border-teal-500 p-3 relative flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div
        className={`sidebar-header flex items-center mb-4 p-2 bg-teal-500/20 rounded-md transition-all duration-300 
    ${collapsed ? "justify-center w-full" : "justify-between"}`}
      >
        {!collapsed && (
          <h2 className="text-teal-200 block">
            <span className="text-lg font-medium">
              <NavLink to="/dashboard" className="flex items-center gap-2">
                Skill Enhancement
              </NavLink>
            </span>
          </h2>
        )}

        <ChevronRight
          className={`text-teal-400 cursor-pointer transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
          onClick={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* sidebar body */}
      <div className="sidebar-body flex flex-col justify-between h-[calc(100%-4rem-1rem)] overflow-y-auto">
        {/* menu-list */}
        <div className="menu-list space-y-2">
          {filteredMenu.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="flex items-center gap-2 text-teal-200 hover:text-teal-100"
            >
              <li
                key={index}
                className={`flex items-center px-3 py-2 bg-teal-500/25 hover:bg-teal-700 rounded-md cursor-pointer text-md w-full
          ${collapsed ? "justify-center gap-0" : "gap-4"}
        `}
              >
                <span className="text-teal-200">{item.icon}</span>
                {!collapsed && (
                  <span className="text-teal-200">{item.title}</span>
                )}
              </li>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer flex items-center justify-center mt-4">
          <button
            className="border-1 border-rose-400 bg-rose-500/20 text-md flex-1 h-10 rounded-md shadow-sm hover:bg-rose-700/50 flex items-center justify-center gap-4 text-rose-100 cursor-pointer transition-colors duration-300"
            onClick={handleLogout}
          >
            {!collapsed && "Logout"} <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
