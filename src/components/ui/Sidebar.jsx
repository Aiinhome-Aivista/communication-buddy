import { useState } from "react";
import { LayoutDashboard, BarChart2, Settings, Info } from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Practice & Test");

  const menuItems = [
    { name: "Practice & Test", icon: <LayoutDashboard size={18} /> },
    { name: "Test Result", icon: <BarChart2 size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-60 bg-white border-r flex flex-col justify-between h-full">
      {/* Menu items */}
      <div className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 w-full text-left px-6 py-2 text-sm font-medium transition-colors ${
              active === item.name
                ? "bg-[#1E293B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      {/* Bottom Help & FAQ */}
      <div className="px-6 py-4 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-gray-700 text-sm">
        <Info size={16} className="text-gray-500" />
        <span>Help and FAQ</span>
      </div>
    </aside>
  );
}
