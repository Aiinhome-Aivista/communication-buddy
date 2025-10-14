import { useState } from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { NavLink, useLocation } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const fullName = sessionStorage.getItem("userName") || "";
  const location = useLocation();
  // Determine role - AuthProvider sets sessionStorage.userRole
  const role = (sessionStorage.getItem("userRole") || "candidate").toLowerCase();

  // Menu configuration for candidate and hr
  const candidateMenu = [
    { name: "Dashboard", icon: (color) => <GridViewRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/dashboard", end: true },
    { name: "Practice & Test", icon: (color) => <AssignmentRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/test" },
    { name: "Test Results", icon: (color) => <BarChartRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/test/result" },
    { name: "Settings", icon: (color) => <SettingsRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/settings" },
  ];

  const hrMenu = [
    { name: "Dashboard", icon: (color) => <GridViewRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/dashboard", end: true },
    { name: "Manage Users", icon: (color) => <GroupAddRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/manage-users", end: true },
    { name: "Schedule Session", icon: (color) => <HourglassBottomRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/schedule" },
    { name: "Test Results", icon: (color) => <BarChartRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/test/result" },
    { name: "Settings", icon: (color) => <SettingsRoundedIcon sx={{ color, fontSize: '1.3rem' }} />, path: "/settings" },
  ];

  const menuItems = role === 'hr' ? hrMenu : candidateMenu;
  return (
    <aside
      className={`${collapsed ? "w-18" : "w-60"
        } bg-white h-screen border-t border-t-[#FFFFFF] border-[#BCC7D2] border-r border-b flex flex-col transition-all duration-200 overflow-hidden`}
    >
      <div className={`flex items-center border-b border-[#BCC7D2] h-[calc(9%)] ${collapsed ? "justify-between px-2" : "justify-between"}`}>
        <div className="w-[calc(17%)]"></div>
        <div className="flex items-center justify-center text-center text-sm text-[#000000] gap-2 w-[calc(66%)]">
          <div>
            <AccountCircleRoundedIcon sx={{ color: '#BCC7D2', fontSize: '2rem', fontWeight: 'medium' }} />
          </div>
          {!collapsed && <p className="font-medium text-[#2C2E42]">{fullName}</p>}
        </div>
        <button
          className="text-gray-400 hover:text-gray-800 transition w-[calc(17%)] flex items-center justify-center text-center cursor-pointer"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 'small', fontWeight: 'medium', color: '#8F96A9' }} />
          ) : (
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 'small', fontWeight: 'medium', color: '#8F96A9' }} />
          )}
        </button>
      </div>
      <div className="h-[calc(81%)]">
        {/* Menu */}
        <nav className={`mt-2 ${collapsed ? 'px-4' : 'px-3'}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => {
                // Custom active logic for "Practice & Test"
                let isActuallyActive = isActive;
                if (item.path === "/test") {
                  isActuallyActive = location.pathname.startsWith("/test") && !location.pathname.startsWith("/test/result");
                }

                return `group flex items-center gap-1 rounded-lg my-1 text-sm font-medium transition-colors ${isActuallyActive
                  ? "bg-[#182938] text-[#FEFEFE] active-link"
                  : "text-[#182938] hover:bg-[#182938]/15 hover:text-[#182938]"
                  } ${collapsed ? "h-10 w-10 justify-center" : "w-full py-2 pl-2"}`;
              }}
            >
              {({ isActive }) => (
                <>
                  <div className="group-hover:text-[#3B4A5A]">
                    {item.icon(isActive && (item.path !== "/test" || (location.pathname.startsWith("/test") && !location.pathname.startsWith("/test/result"))) ? '#FEFEFE' : '#182938')}
                  </div>
                  {!collapsed && item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className={`flex items-center border-t border-[#BCC7D2] px-3 h-[calc(10.5%)] ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center space-x-1">
          <InfoRoundedIcon sx={{ color: "#7E8489" }} />
          {!collapsed && (
            <span className="font-medium text-[#7E8489] text-sm">Help and FAQ</span>
          )}
        </div>
      </div>
    </aside>
  );
}
